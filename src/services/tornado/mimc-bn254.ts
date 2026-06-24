// MiMC over BN254 scalar field (alt_bn128 Fr), Miyaguchi-Preneel mode.
// Browser/TS port of programs/sealed/test/mimc-bn254-ref.mjs — byte-identical to
// go-algorand's `mimc BN254Mp110` opcode (gnark-crypto ecc/bn254/fr/mimc) and to
// circuits/mimc_bn254.circom. The web client MUST match all three or proofs and
// on-chain leaves diverge. See onchain-mimc-tornado-decision memory.
//
// Spec (gnark-crypto): p = BN254 Fr, rounds = 110, sbox x^5, seed "seed",
// round constants via LEGACY keccak256 (NOT sha3-256):
//   rnd = keccak256("seed"); for i in 0..110: rnd = keccak256(rnd); c[i] = rnd mod p
//   => c[0] = keccak256(keccak256("seed")) mod p (double hash, first const != 0)
// encrypt(m; key=h): for i: m = (m + h + c[i])^5; return m + h
// Miyaguchi-Preneel: h = 0; per 32B BE block m_i: h = encrypt(m_i, h) + h + m_i

import { keccak_256 } from "@noble/hashes/sha3.js";

export const P =
  21888242871839275222246405745257275088548364400416034343698204186575808495617n;

const ROUNDS = 110;

function bytesToBigInt(bytes: Uint8Array): bigint {
  let x = 0n;
  for (const b of bytes) x = (x << 8n) | BigInt(b);
  return x;
}

function buildConstants(): bigint[] {
  const cs: bigint[] = [];
  // Prime the hash with keccak256("seed"), then double-hash forward.
  let rnd = keccak_256(new TextEncoder().encode("seed"));
  for (let i = 0; i < ROUNDS; i++) {
    rnd = keccak_256(rnd);
    cs.push(bytesToBigInt(rnd) % P);
  }
  return cs;
}

const CONSTANTS = buildConstants();

function fadd(a: bigint, b: bigint): bigint {
  const r = (a + b) % P;
  return r < 0n ? r + P : r;
}
function fmul(a: bigint, b: bigint): bigint {
  return (a * b) % P;
}
function fpow5(x: bigint): bigint {
  const x2 = fmul(x, x);
  const x4 = fmul(x2, x2);
  return fmul(x4, x);
}

function encrypt(m: bigint, h: bigint): bigint {
  for (let i = 0; i < ROUNDS; i++) {
    const t = fadd(fadd(m, h), CONSTANTS[i]);
    m = fpow5(t);
  }
  return fadd(m, h);
}

/** Hash a multiple-of-32-byte big-endian input. Throws on a non-canonical
 *  block (value >= p) — mirrors the AVM opcode, which REJECTS rather than
 *  reduces. Callers must guarantee each block < p. */
export function mimcBN254(bytes: Uint8Array): Uint8Array {
  if (bytes.length % 32 !== 0) {
    throw new Error(`input length must be a multiple of 32, got ${bytes.length}`);
  }
  let h = 0n;
  for (let off = 0; off < bytes.length; off += 32) {
    const raw = bytesToBigInt(bytes.subarray(off, off + 32));
    if (raw >= P) {
      throw new Error(
        `invalid fr.Element encoding at offset ${off}: value >= field modulus (AVM rejects)`,
      );
    }
    const r = encrypt(raw, h);
    h = fadd(fadd(r, h), raw);
  }
  const out = new Uint8Array(32);
  let x = h;
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}

// --- field-element <-> 32-byte big-endian helpers ----------------------------

export function bigintTo32BE(x: bigint): Uint8Array {
  if (x < 0n || x >= P) throw new Error(`out of range: ${x}`);
  const b = new Uint8Array(32);
  let v = x;
  for (let i = 31; i >= 0; i--) {
    b[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return b;
}

export const be32ToBigint = bytesToBigInt;

/** mimc over a single 32B field element (== circom MiMCHash(1), the deposit leaf). */
export function mimc1(a: bigint): bigint {
  return be32ToBigint(mimcBN254(bigintTo32BE(a)));
}

/** mimc over two 32B field elements (== circom MiMCHash(2), tree node / nullifier). */
export function mimc2(a: bigint, b: bigint): bigint {
  const c = new Uint8Array(64);
  c.set(bigintTo32BE(a), 0);
  c.set(bigintTo32BE(b), 32);
  return be32ToBigint(mimcBN254(c));
}

export function toHex(u8: Uint8Array): string {
  return Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
}
