// MiMC top-up: client-side code generation + on-chain MiMC-tree deposit.
//
// Replaces the SNARK single-payment purchase (PurchaseService) for /top-up.
// Each "code" is a locally generated secret whose leaf is deposited into the
// app's on-chain MiMC tree via a 2-txn group [pay(price), appcall deposit(leaf)].
// The backup note IS the redeem secret — generated on-device, never server-side,
// so there is NO server stock limit (quantity is unbounded). Redeem happens
// later in the Sealed app from a fresh, unlinked wallet via ZK proof.

import algosdk from "algosdk";
import { ALGOD } from "@/services/PurchaseService";
import { depositTopUp, type WalletSigner } from "@/services/tornado/deposit-flow";

const APP_ID = BigInt(process.env.NEXT_PUBLIC_SEALED_APP_ID ?? "763452863");

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

export interface MimcDepositProgress {
  /** 1-based index of the code currently being deposited. */
  index: number;
  total: number;
  phase: "signing" | "confirming";
}

/**
 * Generate `qty` codes and deposit each into the MiMC tree, one signed group
 * per code. Returns the backup notes in order. `qty` is unbounded — the only
 * limit is the buyer's balance and patience (one wallet signature per code).
 *
 * The buyer pays `price + 0.001 (pay fee) + 0.04 (appcall fee)` per code.
 */
export async function depositMany(
  qty: number,
  buyer: string,
  signTransactions: WalletSigner,
  onProgress?: (p: MimcDepositProgress) => void,
): Promise<string[]> {
  if (qty < 1) throw new Error("quantity must be >= 1");
  const price = await readPrice();

  const codes: string[] = [];
  for (let i = 0; i < qty; i++) {
    onProgress?.({ index: i + 1, total: qty, phase: "signing" });
    const res = await depositTopUp({
      algod: ALGOD as unknown as algosdk.Algodv2,
      appId: APP_ID,
      price,
      buyer,
      signTransactions,
      onSigned: () => onProgress?.({ index: i + 1, total: qty, phase: "confirming" }),
    });
    codes.push(res.backupNote);
  }
  return codes;
}
