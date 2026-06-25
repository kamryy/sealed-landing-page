// MiMC top-up: client-side code generation + on-chain MiMC-tree deposit.
//
// Replaces the SNARK single-payment purchase (PurchaseService) for /top-up.
// Each "code" is a locally generated secret whose leaf is deposited into the
// app's on-chain MiMC tree via a 2-txn pair [pay(price), appcall deposit(leaf)].
// The backup note IS the redeem secret — generated on-device, never server-side,
// so there is NO server stock limit (quantity is unbounded). Redeem happens
// later in the Sealed app from a fresh, unlinked wallet via ZK proof.
//
// All codes are signed in ONE wallet prompt. The contract's `deposit` asserts
// groupSize==2 (a [pay, appcall] pair, appcall at index 1), so deposits CANNOT
// share a group — each code is its own 2-txn group. We still sign every group
// in a single signTransactions call (wallets accept multiple groups per prompt),
// then submit each group independently. A group is atomic — it confirms wholly
// or reverts wholly (no partial charge) — so we report exactly which codes
// landed on-chain.

import algosdk from "algosdk";
import { ALGOD } from "@/services/PurchaseService";
import type { WalletSigner } from "@/services/tornado/deposit-flow";
import { buildDepositPair } from "@/services/tornado/tornado-txn";
import {
  generateSecret,
  leafFromSecret,
  toBackupNote,
} from "@/services/tornado/tornado-core";

const APP_ID = BigInt(process.env.NEXT_PUBLIC_SEALED_APP_ID ?? "763452863");

/** Per-code fee: payment 0.001 + appcall 0.04 = 0.041 ALGO (µ). */
const FEES_PER_CODE = 41_000n;
/** Keep this much (µALGO) spare for the account min-balance after paying. */
const MIN_BALANCE_BUFFER = 200_000n;

export interface MimcDepositProgress {
  phase: "signing" | "confirming";
  /** Codes confirmed on-chain so far. */
  confirmed: number;
  total: number;
}

export interface MimcDepositOutcome {
  /** Backup notes for codes that CONFIRMED on-chain (safe to show/redeem). */
  codes: string[];
  /** Count that did not land (user-declined or failed group). */
  failed: number;
  /** Human-readable reasons for any failures (deduped). */
  errors: string[];
}

function to32BE(x: bigint): Uint8Array {
  const b = new Uint8Array(32);
  let v = x;
  for (let i = 31; i >= 0; i--) {
    b[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return b;
}

/** Read the per-code deposit price (µALGO) from the app global `pr`. */
export async function readPrice(): Promise<bigint> {
  const info = await ALGOD.getApplicationByID(APP_ID).do();
  const gs = info.params.globalState ?? [];
  for (const kv of gs) {
    const key =
      kv.key instanceof Uint8Array
        ? kv.key
        : Uint8Array.from(atob(String(kv.key)), (c) => c.charCodeAt(0));
    if (new TextDecoder().decode(key) === "pr") return BigInt(kv.value.uint ?? 0);
  }
  throw new Error("price (pr) not set on app");
}

/** Map low-level signer/wallet errors to a clear, user-facing message. */
function classifySignError(err: unknown): string {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (/popup|blocked|window|open/.test(msg))
    return "Wallet popup was blocked. Allow popups for this site and try again.";
  if (/reject|denied|cancel|declined|closed/.test(msg))
    return "You declined the signature in your wallet.";
  if (/timeout|timed out/.test(msg))
    return "Wallet did not respond in time. Try again.";
  return err instanceof Error ? err.message : "Wallet signing failed.";
}

/**
 * Generate `qty` codes and deposit their leaves into the MiMC tree, signing
 * ALL of them in ONE wallet prompt. Returns the backup notes that confirmed
 * on-chain plus any failures. `qty` is unbounded (very large batches may exceed
 * a wallet's per-request limit; if so they reject the whole prompt and we
 * surface that — nothing is charged).
 *
 * Each code costs `price + 0.041` ALGO; the buyer signs + pays all of it.
 */
export async function depositMany(
  qty: number,
  buyer: string,
  signTransactions: WalletSigner,
  onProgress?: (p: MimcDepositProgress) => void,
): Promise<MimcDepositOutcome> {
  if (qty < 1) throw new Error("Quantity must be at least 1.");

  const price = await readPrice();

  // Balance pre-check — fail BEFORE prompting so we never sign a doomed group.
  const acct = await ALGOD.accountInformation(buyer).do();
  const needed = (price + FEES_PER_CODE) * BigInt(qty) + MIN_BALANCE_BUFFER;
  if (BigInt(acct.amount) < needed) {
    const have = (Number(acct.amount) / 1e6).toFixed(3);
    const want = (Number(needed) / 1e6).toFixed(3);
    throw new Error(
      `Insufficient balance for ${qty} code(s): need ~${want} ALGO, have ${have}.`,
    );
  }

  const sp = await ALGOD.getTransactionParams().do();

  // 1. Generate every secret up front. Codes are only RETURNED once their
  //    group confirms, but generating first keeps the index↔code mapping stable.
  const items = Array.from({ length: qty }, () => {
    const secret = generateSecret();
    return { note: toBackupNote(secret), leaf: to32BE(leafFromSecret(secret)) };
  });

  // 2. Each deposit is its OWN 2-txn group [pay, appcall] — the contract asserts
  //    groupSize==2 with the appcall at index 1, so deposits cannot be merged.
  const groups = items.map((it, j) => {
    const pair = buildDepositPair(
      { algod: ALGOD, appId: APP_ID, buyer, price, leaf: it.leaf },
      sp,
    );
    algosdk.assignGroupID(pair);
    return { txns: pair, itemIdx: [j] };
  });

  // 3. ONE signature for everything (all groups in a single prompt).
  onProgress?.({ phase: "signing", confirmed: 0, total: qty });
  const flat = groups.flatMap((g) => g.txns);
  let signed: (Uint8Array | null)[];
  try {
    signed = await signTransactions(flat);
  } catch (err) {
    // Whole prompt rejected/blocked — nothing was broadcast, nothing charged.
    throw new Error(classifySignError(err));
  }

  // 4. Submit each group independently; collect confirmed codes + failures.
  onProgress?.({ phase: "confirming", confirmed: 0, total: qty });
  const codes: string[] = [];
  const errors = new Set<string>();
  let cursor = 0;
  let confirmed = 0;

  for (const g of groups) {
    const blobs = signed.slice(cursor, cursor + g.txns.length);
    cursor += g.txns.length;

    if (blobs.some((b) => b == null)) {
      errors.add("Some codes were not signed and were skipped.");
      continue;
    }
    try {
      const sent = await ALGOD.sendRawTransaction(blobs as Uint8Array[]).do();
      await algosdk.waitForConfirmation(ALGOD, sent.txid, 8);
      for (const idx of g.itemIdx) codes.push(items[idx].note);
      confirmed += g.itemIdx.length;
      onProgress?.({ phase: "confirming", confirmed, total: qty });
    } catch (err) {
      errors.add(err instanceof Error ? err.message : "A deposit group failed.");
    }
  }

  if (codes.length === 0) {
    throw new Error([...errors][0] ?? "All deposits failed; nothing was charged.");
  }
  return { codes, failed: qty - codes.length, errors: [...errors] };
}
