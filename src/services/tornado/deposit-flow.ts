// Production web-client responsibility: gen secret on-device, add its leaf to
// the on-chain MiMC tree (deposit), hand the user their backup code. NO proof,
// NO redeem here — those happen later in the Flutter app from a fresh, unlinked
// wallet. Deposit is public by design (anonymity comes from the fresh redeem
// wallet + ZK proof, not from hiding the deposit).

import algosdk from "algosdk";
import { generateSecret, leafFromSecret, toBackupNote } from "./tornado-core";
import { buildDepositGroup } from "./tornado-txn";

/** use-wallet signer shape: signs a txn group, returns signed blobs. */
export type WalletSigner = (
  txns: algosdk.Transaction[],
) => Promise<(Uint8Array | null)[]>;

export interface DepositParams {
  algod: algosdk.Algodv2;
  appId: bigint;
  /** Fixed deposit price (µALGO), read from app global `pr`. */
  price: bigint;
  /** Connected wallet address that pays + signs the deposit. */
  buyer: string;
  signTransactions: WalletSigner;
  /** Optional: caller-supplied secret (re-deposit / restore). Default: fresh. */
  backupNote?: string;
  onSigned?: () => void;
}

export interface DepositResult {
  txid: string;
  /** 32-char hex backup code — the ONLY way to redeem later. Show + force save. */
  backupNote: string;
  /** 32-byte leaf hex (= mimc1(secret)) inserted into the tree. */
  leafHex: string;
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

const hex = (b: Uint8Array) =>
  Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

/**
 * Generate a secret, deposit its leaf via the connected wallet, return the
 * backup code. The caller MUST have the user save the code BEFORE calling this
 * (lost code = unredeemable funds; operator cannot recover — that is the point).
 */
export async function depositTopUp(p: DepositParams): Promise<DepositResult> {
  const secret = p.backupNote
    ? (await import("./tornado-core")).secretFromNote(p.backupNote)
    : generateSecret();
  const leaf = leafFromSecret(secret);
  const leafBytes = to32BE(leaf);

  const group = await buildDepositGroup({
    algod: p.algod,
    appId: p.appId,
    buyer: p.buyer,
    price: p.price,
    leaf: leafBytes,
  });

  const signed = await p.signTransactions(group);
  p.onSigned?.();

  const sent = await p.algod
    .sendRawTransaction(signed.filter((s): s is Uint8Array => s != null))
    .do();
  await algosdk.waitForConfirmation(p.algod, sent.txid, 8);

  return {
    txid: sent.txid,
    backupNote: toBackupNote(secret),
    leafHex: hex(leafBytes),
  };
}
