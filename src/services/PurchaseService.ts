import algosdk from "algosdk";
import { Aead, CipherSuite, Kdf, Kem } from "hpke-js";

// ─── Konfiguracja ────────────────────────────────────────────────────────────

const APP_ID = BigInt(process.env.NEXT_PUBLIC_SEALED_APP_ID ?? "3615523287");

const ALGOD_BASE = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/algod`;

// const ALGOD_BASE =
//   typeof window !== "undefined"
//     ? `${window.location.origin}/api/algod`
//     : "/api/algod";

export const ALGOD = new algosdk.Algodv2("", ALGOD_BASE, "");

// Local dev only: Next serves on :3000, so the algod proxy lives there too.
// In prod ALGOD_BASE is an https origin (port 443) — forcing :3000 breaks it.
if (ALGOD_BASE.includes("localhost")) {
  // @ts-expect-error - nadpisujemy wewnętrzny fetch
  ALGOD.c.bc.baseURL.port = "3000";
}

const SUITE = new CipherSuite({
  kem: Kem.DhkemX25519HkdfSha256,
  kdf: Kdf.HkdfSha256,
  aead: Aead.Chacha20Poly1305,
});

// ─── Typy ────────────────────────────────────────────────────────────────────

export type PurchaseResult = {
  txid: string;
  deliveryPub: Uint8Array;
  deliveryPriv: Uint8Array;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Liczy SHA-256 — klucz dostawy w endpoincie odbioru to `sha256(deliveryPubkey)`.
async function sha256(b: Uint8Array): Promise<Uint8Array> {
  //@ts-expect-error test
  return new Uint8Array(await crypto.subtle.digest("SHA-256", b));
}

function toHex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

async function generateDeliveryKeypair() {
  const kp = await SUITE.kem.generateKeyPair();
  const publicKey = new Uint8Array(
    await SUITE.kem.serializePublicKey(kp.publicKey),
  );
  const privateKey = new Uint8Array(
    await SUITE.kem.serializePrivateKey(kp.privateKey),
  );
  return { publicKey, privateKey };
}

async function readGlobals() {
  const info = await ALGOD.getApplicationByID(APP_ID).do();
  const gs = info.params.globalState ?? [];

  const read = (k: string): bigint => {
    for (const kv of gs) {
      const key =
        kv.key instanceof Uint8Array
          ? kv.key
          : Uint8Array.from(atob(String(kv.key)), (c) => c.charCodeAt(0));
      if (new TextDecoder().decode(key) === k)
        return BigInt(kv.value.uint ?? 0);
    }
    return 0n;
  };

  return {
    price: read("pr"),
  };
}

/**
 * SNARK-sold purchase: a single payment to the app (treasury) account whose
 * note carries the 32-byte delivery pubkey. The indexer watches this payment
 * and delivers a pre-generated SNARK code (redeemed privately via proof). No
 * on-chain sale pool / appcall — the privacy comes from SNARK redeem, not the
 * purchase. amount = price × qty; the watcher derives qty back from it.
 */
async function buildPurchaseGroup(
  buyerAddress: string,
  qty: number,
  deliveryPub: Uint8Array,
): Promise<algosdk.Transaction[]> {
  if (qty < 1 || qty > 4) throw new Error("qty musi być w zakresie 1..4");
  if (deliveryPub.length !== 32) throw new Error("deliveryPub must be 32 bytes");

  const { price } = await readGlobals();
  const total = price * BigInt(qty);
  const appAddress = algosdk.getApplicationAddress(APP_ID);
  const sp = await ALGOD.getTransactionParams().do();

  // Algorand wymaga utrzymania min. salda (0.1 ALGO przy 0 ASA) — w innym wypadku
  // węzeł odrzuca płatność. Sprawdzamy przed podpisem, by dać czytelny błąd.
  const MIN_BALANCE = 100_000n; // 0.1 ALGO, konto bez assetów
  const FEE = 1_000n;
  const { amount } = await ALGOD.accountInformation(buyerAddress).do();
  const spendable = BigInt(amount) - MIN_BALANCE - FEE;
  if (total > spendable) {
    const maxAlgo = Number(spendable > 0n ? spendable : 0n) / 1e6;
    throw new Error(
      `Niewystarczające saldo. Maksymalnie do wydania: ${maxAlgo} ALGO ` +
        `(0.1 ALGO musi pozostać, by konto było aktywne).`,
    );
  }

  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: buyerAddress,
    receiver: appAddress,
    amount: total,
    note: deliveryPub,
    suggestedParams: { ...sp, fee: 1000n, flatFee: true },
  });

  return [payTxn];
}

/**
 * Stock pre-check (money-safety): confirm the indexer has ≥ qty codes before
 * the buyer pays, so a payment is only sent when inventory exists. Proxied
 * through the same OHTTP path as delivery. Fails closed on error.
 */
export async function assertStock(qty: number): Promise<void> {
  const res = await fetch(`/api/stock`, { cache: "no-store" });
  if (!res.ok) throw new Error("nie można sprawdzić dostępności kodów");
  const { available } = (await res.json()) as { available: number };
  if (typeof available !== "number" || available < qty) {
    throw new Error("za mało kodów w sprzedaży (sold out)");
  }
}

// ─── API public ────────────────────────────────────────────────────────────

export async function purchase(
  qty: number,
  activeAddress: string,
  signTransactions: (
    txns: algosdk.Transaction[],
  ) => Promise<(Uint8Array | null)[]>,
  onSigned?: () => void,
): Promise<PurchaseResult> {
  const { publicKey: deliveryPub, privateKey: deliveryPriv } =
    await generateDeliveryKeypair();

  // Klucz prywatny w sessionStorage — konieczny do odszyfrowania kodów po zakupie.
  sessionStorage.setItem("deliveryPriv", toHex(deliveryPriv));
  sessionStorage.setItem("deliveryPub", toHex(deliveryPub));

  const group = await buildPurchaseGroup(activeAddress, qty, deliveryPub);

  const signed = await signTransactions(group);

  // Signed — now broadcasting and waiting for on-chain confirmation.
  onSigned?.();

  const sent = await ALGOD.sendRawTransaction(
    signed.filter(Boolean) as Uint8Array[],
  ).do();

  await algosdk.waitForConfirmation(ALGOD, sent.txid, 8);

  return { txid: sent.txid, deliveryPub, deliveryPriv };
}

const WIRE_VERSION = 0x01;
const WIRE_INFO = new TextEncoder().encode("sealed.codes.v1");
const KEM_ENC_LEN = 32;

interface DeliveryPayload {
  codes: string[];
  purchasedAtRound: string;
}

// Odszyfrowuje paczkę „wire" kluczem prywatnym dostawy i wyciąga listę kodów.
async function decryptDelivery(
  wire: Uint8Array,
  deliveryPriv: Uint8Array,
): Promise<DeliveryPayload> {
  if (wire[0] !== WIRE_VERSION)
    throw new Error(`nieobsługiwana wersja: ${wire[0]}`);
  const enc = wire.slice(1, 1 + KEM_ENC_LEN);
  const aeadOutput = wire.slice(1 + KEM_ENC_LEN);

  //@ts-expect-error test
  const recipientKey = await SUITE.kem.importKey("raw", deliveryPriv, false);
  const recipient = await SUITE.createRecipientContext({
    recipientKey,
    enc,
    info: WIRE_INFO,
  });
  const plaintext = new Uint8Array(await recipient.open(aeadOutput));

  const json = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(plaintext),
  );
  return { codes: json.codes, purchasedAtRound: json.purchasedAtRound };
}

// Odpytuje endpoint co 2 s do skutku (lub timeoutu) i zwraca odszyfrowane kody.
export async function fetchCodes(
  deliveryPub: Uint8Array,
  deliveryPriv: Uint8Array,
  timeoutSec = 60,
): Promise<string[]> {
  const hex = toHex(await sha256(deliveryPub));
  const deadline = Date.now() + timeoutSec * 1000;
  while (Date.now() < deadline) {
    const res = await fetch(`/api/delivery/${hex}`);
    if (res.status === 200) {
      const wire = new Uint8Array(await res.arrayBuffer());
      const payload = await decryptDelivery(wire, deliveryPriv);
      return payload.codes;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("przekroczono czas oczekiwania na dostawę kodów");
}
