// On-chain MiMC Tornado — browser crypto + Groth16 proving core.
// Mirrors circuits/redeem.circom + circuits/scripts/gen-mimc-vectors.mjs.
// Derivation here MUST match the circuit, the JS ref, and the AVM opcode, or
// proofs/leaves diverge. See onchain-mimc-tornado-decision memory.

import { sha256 } from "@noble/hashes/sha2.js";
import { P, mimc1, mimc2, bigintTo32BE } from "./mimc-bn254";

// Field moduli. Public signals (root/nullifier/recipient/denom) live in Fr = P.
// Proof coordinates (G1/G2) live in the base field Fq = Q.
export const FR_MOD = P;
export const Q_MOD =
  21888242871839275222246405745257275088696311157297823662689037894645226208583n;

export const HEIGHT = 16;

// NULL_TAG = bytes("SEALED_NULL_V1__") as Fr (matches redeem.circom line 95).
export const NULL_TAG = 110815058874449983093867477470989876063n;

// Fixed denomination per tree (Tornado-style). MUST equal initMimcTree(denom).
export const DENOMINATION = 500n;

// Zero ladder: zeros[0]=0, zeros[k+1]=mimc(zeros[k]||zeros[k]).
export const ZEROS: bigint[] = (() => {
  const z = [0n];
  for (let i = 0; i < HEIGHT; i++) z.push(mimc2(z[i], z[i]));
  return z;
})();

// --- secret / leaf / nullifier ----------------------------------------------

// CROSS-CLIENT CONTRACT (web deposit <-> Flutter redeem must match byte-for-byte).
// Reuses the app's DEPLOYED code grammar (sealed_app CreditsService): Crockford
// base32, normalize maps I->1 L->1 O->0, preimage = sha256(utf8(normalized))[0..16].
//   - validation alphabet = Crockford `0123456789ABCDEFGHJKMNPQRSTVWXYZ`
//   - GENERATION alphabet excludes 0 and 1 too (UX: no 0/O/1/I/L confusables),
//     a strict subset of the validation set so generated codes are normalize-stable.
//   preimage = BE-bigint( sha256(utf8(normalize(code)))[0..16] ) mod p
//   leaf     = MiMCHash(preimage) ; nullifier = MiMCHash(preimage, NULL_TAG)
export const CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford, validation
const GEN_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"; // 30 chars, no 0/1 (nor O/I/L)
export const CODE_LENGTH = 16;
const CODE_RE = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);

/** A deposit secret: the user's backup code + the derived circuit preimage.
 *  leaf = MiMCHash(preimage) is the on-chain deposit leaf. */
export interface Secret {
  /** 16-char confusion-free backup code — the human-recorded secret. */
  code: string;
  /** preimage as an Fr element, derived from the code. */
  preimage: bigint;
}

/** preimage = BE-bigint(sha256(utf8(code))[0..16]) mod p. Matches the app's
 *  CreditsService.preimageFromCode (sha256 of the normalized code, first 16B). */
function preimageFromCode(code: string): bigint {
  const digest = sha256(new TextEncoder().encode(code)); // 32 bytes
  let v = 0n;
  for (let i = 0; i < 16; i++) v = (v << 8n) | BigInt(digest[i]);
  return v % FR_MOD;
}

/** Generate a fresh 16-char backup code from GEN_ALPHABET (30 chars). Rejection
 *  sampling avoids modulo bias (256 % 30 != 0). */
export function generateCode(): string {
  let out = "";
  const buf = new Uint8Array(1);
  const limit = Math.floor(256 / GEN_ALPHABET.length) * GEN_ALPHABET.length; // 240
  while (out.length < CODE_LENGTH) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) out += GEN_ALPHABET[buf[0] % GEN_ALPHABET.length];
  }
  return out;
}

/** Normalize user input, byte-identical to the app's normalizeCode: uppercase,
 *  strip dashes/spaces, map confusables I->1 L->1 O->0. */
export function normalizeCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/O/g, "0");
}

/** Build a Secret from a (normalized) 16-char code. Throws on bad format. */
export function secretFromCode(code: string): Secret {
  const c = normalizeCode(code);
  if (!CODE_RE.test(c)) {
    throw new Error(`code must be ${CODE_LENGTH} chars from ${CODE_ALPHABET}`);
  }
  return { code: c, preimage: preimageFromCode(c) };
}

/** Generate a fresh deposit secret (new backup code). */
export function generateSecret(): Secret {
  return secretFromCode(generateCode());
}

/** The user's backup code (what they record to redeem later). */
export function toBackupNote(s: Secret): string {
  return s.code;
}

/** Reconstruct a secret from its backup code. */
export function secretFromNote(note: string): Secret {
  return secretFromCode(note);
}

/** leaf = MiMCHash(preimage). Submitted on-chain as the deposit leaf (32B BE). */
export function leafFromSecret(s: Secret): bigint {
  return mimc1(s.preimage);
}

/** nullifier = MiMCHash(preimage, NULL_TAG). Public signal; double-spend guard. */
export function nullifierFromSecret(s: Secret): bigint {
  return mimc2(s.preimage, NULL_TAG);
}

// --- Merkle path -------------------------------------------------------------

export interface MerklePath {
  pathElements: bigint[]; // sibling at each level
  pathIndices: number[]; // 0 = cur is left child, 1 = right
  root: bigint;
}

/** Path for a leaf that is the LEFTMOST (index 0) in a fresh tree — every
 *  sibling is the zero of its level. Matches the gen-mimc-vectors construction
 *  and the contract's single-deposit root. For multi-leaf trees the indexer (or
 *  on-chain rebuild) supplies the real siblings; see W2/indexer. */
export function index0Path(leaf: bigint): MerklePath {
  const pathElements: bigint[] = [];
  const pathIndices: number[] = [];
  let cur = leaf;
  for (let level = 0; level < HEIGHT; level++) {
    pathElements.push(ZEROS[level]);
    pathIndices.push(0);
    cur = mimc2(cur, ZEROS[level]); // leaf is left child at every level
  }
  return { pathElements, pathIndices, root: cur };
}

/** Membership path for the leaf just inserted at `leafIndex`, derived from the
 *  tree FRONTIER (`filledSubtrees`) read on-chain BEFORE the deposit. Mirrors
 *  the contract's incremental insert exactly (contract.algo.ts deposit()):
 *  at each level the sibling is the cached left subtree (`filledSubtrees[level]`)
 *  when the node is a right child, else the level's zero. Works for ANY tree
 *  state — the path's root is the post-insert root that lands in the ring. */
export function pathFromFrontier(
  filledSubtrees: bigint[],
  leafIndex: number,
  leaf: bigint,
): MerklePath {
  if (filledSubtrees.length !== HEIGHT) {
    throw new Error(`filledSubtrees must have ${HEIGHT} levels`);
  }
  const pathElements: bigint[] = [];
  const pathIndices: number[] = [];
  let cur = leaf;
  let idx = leafIndex;
  for (let level = 0; level < HEIGHT; level++) {
    const bit = idx & 1;
    const sibling = bit ? filledSubtrees[level] : ZEROS[level];
    pathElements.push(sibling);
    pathIndices.push(bit);
    cur = bit ? mimc2(sibling, cur) : mimc2(cur, sibling);
    idx >>= 1;
  }
  return { pathElements, pathIndices, root: cur };
}

/** General incremental-tree path from the full ordered leaf list (on-chain
 *  rebuild / indexer fallback). leafIndex is the position of the target leaf. */
export function pathFromLeaves(leaves: bigint[], leafIndex: number): MerklePath {
  if (leafIndex < 0 || leafIndex >= leaves.length) {
    throw new Error(`leafIndex ${leafIndex} out of range (${leaves.length})`);
  }
  const pathElements: bigint[] = [];
  const pathIndices: number[] = [];
  // Current level node list, padded with zeros as the tree fills.
  let level = leaves.slice();
  let idx = leafIndex;
  for (let h = 0; h < HEIGHT; h++) {
    const isRight = idx & 1;
    const siblingIdx = isRight ? idx - 1 : idx + 1;
    const sibling = siblingIdx < level.length ? level[siblingIdx] : ZEROS[h];
    pathElements.push(sibling);
    pathIndices.push(isRight);
    // Build the next level up.
    const next: bigint[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const l = level[i];
      const r = i + 1 < level.length ? level[i + 1] : ZEROS[h];
      next.push(mimc2(l, r));
    }
    level = next.length ? next : [ZEROS[h + 1]];
    idx >>= 1;
  }
  return { pathElements, pathIndices, root: level[0] };
}

// --- circuit witness input ---------------------------------------------------

export interface RedeemInput {
  root: string;
  nullifier: string;
  recipient: string;
  denomination: string;
  preimage: string;
  pathElements: string[];
  pathIndices: string[];
}

/** recipient = (BE uint of 32B ed25519/algo pubkey) mod Fr, non-zero. */
export function recipientFromPubkey(pubkey: Uint8Array): bigint {
  if (pubkey.length !== 32) throw new Error("pubkey must be 32 bytes");
  let v = 0n;
  for (const b of pubkey) v = (v << 8n) | BigInt(b);
  const r = v % FR_MOD;
  return r === 0n ? 1n : r;
}

/** Assemble the snarkjs witness input for a redeem proof. */
export function buildRedeemInput(
  s: Secret,
  path: MerklePath,
  recipient: bigint,
): RedeemInput {
  return {
    root: path.root.toString(),
    nullifier: nullifierFromSecret(s).toString(),
    recipient: recipient.toString(),
    denomination: DENOMINATION.toString(),
    preimage: s.preimage.toString(),
    pathElements: path.pathElements.map((x) => x.toString()),
    pathIndices: path.pathIndices.map((x) => x.toString()),
  };
}

// --- proof / public-input serialization (parity with redeem test harness) ----

export interface SnarkProof {
  pi_a: [string, string, string];
  pi_b: [[string, string], [string, string], [string, string]];
  pi_c: [string, string, string];
  protocol: string;
  curve: string;
}

// Proof coords are < Q but may be >= P; pad raw 32B BE without the mimc < p
// guard (that guard is only for Fr field elements / leaves).
function raw32BE(dec: string): Uint8Array {
  let v = BigInt(dec);
  if (v < 0n || v >= Q_MOD) throw new Error(`fe out of range: ${dec}`);
  const b = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) {
    b[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return b;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

function g1Bytes(pt: [string, string, string]): Uint8Array {
  return concatBytes(raw32BE(pt[0]), raw32BE(pt[1]));
}
function g2Bytes(
  pt: [[string, string], [string, string], [string, string]],
): Uint8Array {
  return concatBytes(
    raw32BE(pt[0][0]),
    raw32BE(pt[0][1]),
    raw32BE(pt[1][0]),
    raw32BE(pt[1][1]),
  );
}

/** snarkjs proof -> 256-byte on-chain proof (A_G1 || B_G2 || C_G1). */
export function proofToBytes(p: SnarkProof): Uint8Array {
  const out = concatBytes(g1Bytes(p.pi_a), g2Bytes(p.pi_b), g1Bytes(p.pi_c));
  if (out.length !== 256) throw new Error(`proof len ${out.length} != 256`);
  return out;
}

/** [root, nullifier, recipient, denomination] -> 128-byte public inputs. */
export function publicInputsToBytes(
  root: bigint,
  nullifier: bigint,
  recipient: bigint,
  denomination: bigint,
): Uint8Array {
  const out = concatBytes(
    bigintTo32BE(root),
    bigintTo32BE(nullifier),
    bigintTo32BE(recipient),
    bigintTo32BE(denomination),
  );
  if (out.length !== 128) throw new Error(`pub len ${out.length} != 128`);
  return out;
}
