// On-chain MiMC Tornado — Algorand transaction builders (signer-agnostic).
// Ports the group construction from the contract's on-chain test harness
// (programs/sealed/src/__tests__/integration/{deposit,redeem_with_proof_mimc}.test.ts).
// Builders are pure — they take algosdk params and return unsigned txns, so the
// same code drives the Node E2E harness (localnet keys) and the browser UI
// (use-wallet signer).

import algosdk from "algosdk";

const DEPOSIT_SELECTOR = new Uint8Array(
  algosdk.ABIMethod.fromSignature("deposit(byte[32])void").getSelector(),
);
const REDEEM_MIMC_SELECTOR = new Uint8Array(
  algosdk.ABIMethod.fromSignature(
    "redeemWithProofMimc(byte[32],byte[32],byte[],byte[],byte[])void",
  ).getSelector(),
);

const te = (s: string) => new TextEncoder().encode(s);

/** ABI byte[] = uint16 big-endian length prefix + bytes. */
function abiBytes(b: Uint8Array): Uint8Array {
  const out = new Uint8Array(2 + b.length);
  new DataView(out.buffer).setUint16(0, b.length, false);
  out.set(b, 2);
  return out;
}

function randomNote(): Uint8Array {
  const n = new Uint8Array(8);
  crypto.getRandomValues(n);
  return n;
}

// --- deposit -----------------------------------------------------------------

export interface DepositGroupParams {
  algod: algosdk.Algodv2;
  appId: bigint;
  /** Buyer = the connected/funding wallet that pays the deposit price. */
  buyer: string;
  /** Fixed deposit price (µALGO) read from app global `pr`. */
  price: bigint;
  /** 32-byte MiMC leaf = mimc1(preimage). */
  leaf: Uint8Array;
}

/** Build the 2-txn deposit group [pay(price->app, fee 1000), appcall
 *  deposit(leaf) fee 40000 + boxes mfs/mqr]. Both signed by the buyer. */
export async function buildDepositGroup(
  p: DepositGroupParams,
): Promise<algosdk.Transaction[]> {
  if (p.leaf.length !== 32) throw new Error("leaf must be 32 bytes");
  const appAddress = algosdk.getApplicationAddress(p.appId);
  const sp = await p.algod.getTransactionParams().do();

  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: p.buyer,
    receiver: appAddress,
    amount: p.price,
    suggestedParams: { ...sp, fee: 1000n, flatFee: true },
  });

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    sender: p.buyer,
    appIndex: p.appId,
    appArgs: [DEPOSIT_SELECTOR, p.leaf],
    boxes: [
      { appIndex: p.appId, name: te("mfs") },
      { appIndex: p.appId, name: te("mqr") },
    ],
    // 16 mimc hashes ~= 25 OpUp inner txns; 40k µALGO covers the pooled fee.
    suggestedParams: { ...sp, fee: 40_000n, flatFee: true },
    note: randomNote(),
  });

  algosdk.assignGroupID([payTxn, appCallTxn]);
  return [payTxn, appCallTxn];
}

// --- redeem ------------------------------------------------------------------

export interface RedeemGroupParams {
  algod: algosdk.Algodv2;
  appId: bigint;
  /** Fresh, unlinked redeeming wallet (signs the 0-fee appcall). */
  user: string;
  /** Escrow LogicSig account that pays the pooled fee (user pays 0 ALGO). */
  escrow: algosdk.LogicSigAccount;
  rootRef: Uint8Array; // 32B
  nullifier: Uint8Array; // 32B
  proof: Uint8Array; // 256B
  publicInputs: Uint8Array; // 128B
  username?: string;
}

export interface RedeemGroup {
  /** [feeTxn (escrow self-pay), appCallTxn]. */
  txns: algosdk.Transaction[];
  /** Index of the txn the fresh user must sign (the appcall). */
  userSignIndex: number;
}

/** Build the escrow redeem group [escrowSelfPay(fee 250000), appcall
 *  redeemWithProofMimc(... fee 0) + boxes mqr/nb:/w:[/n:]]. The escrow txn is
 *  signed here (LogicSig); the appcall must be signed by `user`. */
export async function buildRedeemGroup(
  p: RedeemGroupParams,
): Promise<RedeemGroup> {
  if (p.proof.length !== 256) throw new Error("proof must be 256 bytes");
  if (p.publicInputs.length !== 128)
    throw new Error("publicInputs must be 128 bytes");

  const userPub = algosdk.decodeAddress(p.user).publicKey;
  const usernameBytes = p.username ? te(p.username) : new Uint8Array();

  const nbBoxKey = new Uint8Array(3 + 32);
  nbBoxKey.set(te("nb:"), 0);
  nbBoxKey.set(p.nullifier, 3);
  const wBoxKey = new Uint8Array(2 + 32);
  wBoxKey.set(te("w:"), 0);
  wBoxKey.set(userPub, 2);

  const boxes: { appIndex: bigint; name: Uint8Array }[] = [
    { appIndex: p.appId, name: te("mqr") },
    { appIndex: p.appId, name: nbBoxKey },
    { appIndex: p.appId, name: wBoxKey },
  ];
  if (usernameBytes.length > 0) {
    const { sha256 } = await import("@noble/hashes/sha2.js");
    const nameKey = new Uint8Array(2 + 32);
    nameKey.set(te("n:"), 0);
    nameKey.set(sha256(usernameBytes), 2);
    boxes.push({ appIndex: p.appId, name: nameKey });
  }

  const sp = await p.algod.getTransactionParams().do();
  const FEE_POOL = 250_000n;
  const escrowAddr = p.escrow.address().toString();

  const feeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: escrowAddr,
    receiver: escrowAddr,
    amount: 0n,
    suggestedParams: { ...sp, fee: FEE_POOL, flatFee: true },
  });

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    sender: p.user,
    appIndex: p.appId,
    appArgs: [
      REDEEM_MIMC_SELECTOR,
      p.rootRef,
      p.nullifier,
      abiBytes(p.proof),
      abiBytes(p.publicInputs),
      abiBytes(usernameBytes),
    ],
    boxes,
    suggestedParams: { ...sp, fee: 0n, flatFee: true },
    note: randomNote(),
  });

  algosdk.assignGroupID([feeTxn, appCallTxn]);
  return { txns: [feeTxn, appCallTxn], userSignIndex: 1 };
}

/** Sign the escrow fee txn with the LogicSig (call after building the group). */
export function signEscrowFeeTxn(
  feeTxn: algosdk.Transaction,
  escrow: algosdk.LogicSigAccount,
): Uint8Array {
  return algosdk.signLogicSigTransactionObject(feeTxn, escrow).blob;
}
