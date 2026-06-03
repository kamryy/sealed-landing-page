# Sealed LP — Integracja zakupu kodów (przewodnik dla programisty)

Ten dokument zawiera wszystko, co potrzebne, by podłączyć stronę LP do kontraktu
Sealed i sprzedawać kody (redeem codes). Trzy kroki:

1. Podłączenie portfela (Lute / Pera / Defly)
2. Zbudowanie i wysłanie transakcji zakupu
3. Odbiór kodów przez OHTTP i ich odszyfrowanie

Logika kupna i odbioru jest już zweryfikowana end-to-end na testnecie — poniższy
kod odwzorowuje działający przepływ.

---

## 0. Wartości produkcyjne (testnet)

| Co | Wartość |
|---|---|
| App ID kontraktu | `763452863` |
| Sieć | Algorand **testnet** |
| Algod | `https://testnet-api.algonode.cloud` |
| Cena za kod | `10 ALGO` (= `10_000_000 µALGO`) — **czytaj z globala `pr`, nie hardkoduj** |
| Max kodów na jedno wywołanie | **4** (limit kontraktu) — większe ilości = pętla wielu wywołań |
| Portfele | Pera, Defly, Lute |

**Ważne — prywatność:** żadne wywołanie do algod ani do endpointu dostawy nie może
iść bezpośrednio z przeglądarki. Wszystko przechodzi przez własne route handlery
Next.js (sekcja 4) — na testnecie relayują zwykłym HTTPS (serwer LP ukrywa IP
kupującego), pełne OHTTP to TODO przed mainnetem. W kodzie poniżej `ALGOD` i `fetch`
oznaczają wywołania do **własnego backendu**, nie do publicznego węzła.

---

## 1. Podłączenie portfela

*Po co: pozwala kupującemu wybrać portfel (Pera/Defly/Lute) i podpisać nim transakcję — bez połączonego portfela nie ma kto zapłacić.*

Biblioteka: `@txnlab/use-wallet-react`. Przed instalacją sprawdź zgodność
peer-deps z Next 16 / React 19.

```bash
npm install @txnlab/use-wallet-react algosdk hpke-js
```

Konfiguracja menedżera portfeli (Pera + Defly + Lute) i provider:

```tsx
// app/providers.tsx
// Rejestruje trzy portfele i opakowuje aplikację, by hook useWallet() działał wszędzie.
'use client';
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';

const manager = new WalletManager({
  wallets: [WalletId.PERA, WalletId.DEFLY, WalletId.LUTE],
  defaultNetwork: NetworkId.TESTNET,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider manager={manager}>{children}</WalletProvider>;
}
```

Ekran „Connect Wallet” — lista portfeli i połączenie:

```tsx
// Renderuje przyciski portfeli; klik łączy wybrany portfel i ustawia activeAddress.
'use client';
import { useWallet } from '@txnlab/use-wallet-react';

export function ConnectWallet() {
  const { wallets, activeAddress } = useWallet();
  if (activeAddress) return <p>Połączono: {activeAddress}</p>;
  return (
    <div>
      {wallets.map((w) => (
        <button key={w.id} onClick={() => w.connect()}>
          {w.metadata.name}
        </button>
      ))}
    </div>
  );
}
```

Po połączeniu masz `activeAddress` (string) oraz funkcję `signTransactions`
z hooka `useWallet()` — użyjesz ich w kroku 2.

---

## 2. Transakcja zakupu kodów

*Po co: to właściwy zakup — kupujący płaci ALGO i rezerwuje kody w kontrakcie.*

Zakup to **grupa 2 transakcji**, obie podpisane przez portfel kupującego:

- **Txn 0 — Płatność:** kupujący → konto aplikacji, kwota = `qty × cena`.
- **Txn 1 — App-call `purchaseCodes(qty, deliveryPubkey)`.**

Każdy kupowany kod wymaga 2 referencji boxów (`p:<idx>` + `c:<hash>`). Tylko
app-call może nieść referencje boxów → budżet 8 ref ÷ 2 = **max 4 kody**.

### 2a. Pomocnicze funkcje

*Drobne narzędzia używane w 2b–2d (nazwy boxów, skróty, hex).*

```ts
import algosdk from 'algosdk';

const APP_ID = 763452863n;
// Baza wskazuje na własny route handler (sekcja 4), nie na publiczny węzeł.
const ALGOD_BASE =
  typeof window !== 'undefined' ? `${window.location.origin}/api/algod` : '/api/algod';
const ALGOD = new algosdk.Algodv2('', ALGOD_BASE, '');

// Buduje nazwę boxa (prefiks + ciało) — kontrakt adresuje boxy `p:`/`c:` po takich nazwach.
function boxName(prefix: string, body: Uint8Array): Uint8Array {
  const pre = new TextEncoder().encode(prefix);
  const out = new Uint8Array(pre.length + body.length);
  out.set(pre, 0);
  out.set(body, pre.length);
  return out;
}

// Liczy SHA-256 — klucz dostawy w endpoincie odbioru to `sha256(deliveryPubkey)`.
async function sha256(b: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', b));
}

// Zamienia bajty na hex — do URL-i endpointu i zapisu klucza w sessionStorage.
function toHex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}
```

### 2b. Wygenerowanie klucza dostawy (HPKE, w przeglądarce)

*Tworzy parę kluczy, na którą kontrakt każe zaszyfrować kody — bez niej nikt poza kupującym ich nie odczyta.*

Klucz dostawy to para X25519. Klucz publiczny trafia do transakcji; klucz
prywatny zostaje w przeglądarce i służy do odszyfrowania kodów (krok 3).

```ts
import { Aead, CipherSuite, Kdf, Kem } from 'hpke-js';

const SUITE = new CipherSuite({
  kem: Kem.DhkemX25519HkdfSha256,
  kdf: Kdf.HkdfSha256,
  aead: Aead.Chacha20Poly1305,
});

// Zwraca świeżą parę X25519: pub do transakcji, priv do późniejszego odszyfrowania.
async function generateDeliveryKeypair() {
  const kp = await SUITE.kem.generateKeyPair();
  const publicKey = new Uint8Array(await SUITE.kem.serializePublicKey(kp.publicKey));
  const privateKey = new Uint8Array(await SUITE.kem.serializePrivateKey(kp.privateKey));
  return { publicKey, privateKey };
}
```

### 2c. Odczyt danych puli i zbudowanie grupy

*Czyta stan kontraktu (cena, dostępne kody, hashe) i składa podpisywalną grupę 2 transakcji.*

```ts
// Czyta cenę i wskaźniki puli z globali kontraktu — by znać kwotę i czy są wolne kody.
async function readGlobals() {
  const info = await ALGOD.getApplicationByID(APP_ID).do();
  const gs = info.params.globalState ?? [];
  const read = (k: string): bigint => {
    for (const kv of gs) {
      const key = kv.key instanceof Uint8Array ? kv.key : Uint8Array.from(atob(String(kv.key)), (c) => c.charCodeAt(0));
      if (new TextDecoder().decode(key) === k) return BigInt(kv.value.uint ?? 0);
    }
    return 0n;
  };
  return { price: read('pr'), poolHead: read('ph'), poolTail: read('pt') };
}

// Definicja metody ABI `purchaseCodes` — z niej liczony jest selektor i kodowanie argumentów.
const PURCHASE_METHOD = new algosdk.ABIMethod({
  name: 'purchaseCodes',
  args: [
    { type: 'uint64', name: 'qty' },
    { type: 'byte[32]', name: 'deliveryPubkey' },
  ],
  returns: { type: 'void' },
});

// Składa grupę [płatność + purchaseCodes] z referencjami boxów — to jest sam zakup, gotowy do podpisu.
async function buildPurchaseGroup(buyerAddress: string, qty: number, deliveryPub: Uint8Array) {
  if (qty < 1 || qty > 4) throw new Error('qty musi być w zakresie 1..4');

  const { price, poolHead, poolTail } = await readGlobals();
  if (poolTail - poolHead < BigInt(qty)) throw new Error('za mało kodów w puli');

  // Odczyt hashy commitmentów z boxów p:<head+i> (potrzebne do referencji c:<hash>).
  const hashes: Uint8Array[] = [];
  for (let i = 0; i < qty; i++) {
    const name = boxName('p:', algosdk.encodeUint64(poolHead + BigInt(i)));
    const box = await ALGOD.getApplicationBoxByName(APP_ID, name).do();
    hashes.push(box.value);
  }

  const total = price * BigInt(qty);
  const appAddress = algosdk.getApplicationAddress(APP_ID);
  const sp = await ALGOD.getTransactionParams().do();

  // Txn 0 — płatność.
  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: buyerAddress,
    receiver: appAddress,
    amount: total,
    suggestedParams: { ...sp, fee: 1000n, flatFee: true },
  });

  // Txn 1 — app-call. appIndex: 0 = box należący do tej samej aplikacji.
  const boxes: algosdk.BoxReference[] = [];
  for (let i = 0; i < qty; i++) {
    boxes.push({ appIndex: 0, name: boxName('p:', algosdk.encodeUint64(poolHead + BigInt(i))) });
    boxes.push({ appIndex: 0, name: boxName('c:', hashes[i]) });
  }
  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    sender: buyerAddress,
    appIndex: APP_ID,
    appArgs: [
      PURCHASE_METHOD.getSelector(),
      new algosdk.ABIUintType(64).encode(BigInt(qty)),
      deliveryPub, // byte[32] = surowe 32 bajty
    ],
    boxes,
    suggestedParams: { ...sp, fee: 2000n, flatFee: true },
  });

  algosdk.assignGroupID([payTxn, appCallTxn]);
  return [payTxn, appCallTxn];
}
```

### 2d. Podpis portfelem i wysyłka

*Spina całość w jedną akcję „Kup": generuje klucz, buduje grupę, podpisuje portfelem i wysyła do sieci.*

```ts
import { useWallet } from '@txnlab/use-wallet-react';

// Jedna funkcja „Kup N kodów" — od klucza dostawy po potwierdzoną transakcję.
async function purchase(qty: number) {
  const { activeAddress, signTransactions } = useWallet();
  if (!activeAddress) throw new Error('portfel niepołączony');

  const { publicKey: deliveryPub, privateKey: deliveryPriv } = await generateDeliveryKeypair();
  // Zapisz klucz prywatny — bez niego nie odszyfrujesz kodów. Płatność jest nieodwracalna.
  sessionStorage.setItem('deliveryPriv', toHex(deliveryPriv));

  const group = await buildPurchaseGroup(activeAddress, qty, deliveryPub);

  // Portfel (Pera/Defly/Lute) podpisuje obie transakcje.
  const signed = await signTransactions(group);

  // Wysyłka przez klienta `ALGOD` (kieruje na /api/algod → patrz sekcja 4).
  const sent = await ALGOD.sendRawTransaction(signed.filter(Boolean) as Uint8Array[]).do();
  await algosdk.waitForConfirmation(ALGOD, sent.txid, 8);

  // Zwróć klucz dostawy — w kroku 3 odbierasz po jego skrócie sha256.
  return { txid: sent.txid, deliveryPub, deliveryPriv };
}
```

Po potwierdzeniu transakcji kontrakt emituje zdarzenie `CommitmentsSold`, które
po stronie serwera uruchamia dostarczenie zaszyfrowanych kodów.

---

## 3. Odbiór kodów przez OHTTP

*Po co: dostarcza zakupione kody kupującemu — zaszyfrowane, więc tylko on je odczyta.*

Kody są dostarczane asynchronicznie. Pobierasz je z endpointu po kluczu
`sha256(deliveryPubkey)`, a następnie odszyfrowujesz kluczem prywatnym dostawy.

Endpoint (przez własny route handler → OHTTP → indexer):

```
GET /api/delivery/<hex(sha256(deliveryPubkey))>
```

- `404` — jeszcze nie gotowe (odpytuj dalej).
- `200` — body odpowiedzi to surowe bajty „wire” (zaszyfrowana paczka).

### 3a. Odpytywanie i odszyfrowanie

*Odpytuje endpoint aż paczka będzie gotowa, po czym odszyfrowuje ją kluczem prywatnym (HPKE).*

Format „wire”: `wersja (1 bajt = 0x01) || enc (32 bajty) || ciphertext+tag`.
HPKE: ten sam zestaw co przy generowaniu klucza, `info = "sealed.codes.v1"`.

```ts
const WIRE_VERSION = 0x01;
const WIRE_INFO = new TextEncoder().encode('sealed.codes.v1');
const KEM_ENC_LEN = 32;

interface DeliveryPayload {
  codes: string[];
  purchasedAtRound: string;
}

// Odszyfrowuje paczkę „wire" kluczem prywatnym dostawy i wyciąga listę kodów.
async function decryptDelivery(wire: Uint8Array, deliveryPriv: Uint8Array): Promise<DeliveryPayload> {
  if (wire[0] !== WIRE_VERSION) throw new Error(`nieobsługiwana wersja: ${wire[0]}`);
  const enc = wire.slice(1, 1 + KEM_ENC_LEN);
  const aeadOutput = wire.slice(1 + KEM_ENC_LEN);

  const recipientKey = await SUITE.kem.importKey('raw', deliveryPriv, false);
  const recipient = await SUITE.createRecipientContext({ recipientKey, enc, info: WIRE_INFO });
  const plaintext = new Uint8Array(await recipient.open(aeadOutput));

  const json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(plaintext));
  return { codes: json.codes, purchasedAtRound: json.purchasedAtRound };
}

// Odpytuje endpoint co 2 s do skutku (lub timeoutu) i zwraca odszyfrowane kody.
async function fetchCodes(deliveryPub: Uint8Array, deliveryPriv: Uint8Array, timeoutSec = 60): Promise<string[]> {
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
  throw new Error('przekroczono czas oczekiwania na dostawę kodów');
}
```

### 3b. Wyświetlenie i zakończenie

*Pokazuje kody użytkownikowi (raz!) i sprząta klucz prywatny z pamięci.*

```ts
const codes = await fetchCodes(deliveryPub, deliveryPriv);
// Pokaż kody: copy-each, copy-all, download .txt. Duże ostrzeżenie:
//   „Kody widoczne tylko raz. Zapisz je teraz.”
// Po potwierdzeniu „Zapisałem” — wyczyść klucz prywatny:
sessionStorage.removeItem('deliveryPriv');
```

To wszystko — po tym kroku użytkownik ma swoje kody, a klucz dostawy jest
usunięty. Kod wkleja w aplikacji mobilnej Sealed, by odebrać kredyty.

---

## 4. Endpointy i route handlery

*Po co: backend LP pośredniczy w ruchu do algod i indexera — ukrywa kupującego i spełnia wymóg prywatności (przeglądarka nigdy nie woła węzła wprost).*

`/api/algod` i `/api/delivery` to **nie gotowe routey** — budujesz je razem z resztą
tej integracji. Poniżej wersja **gotowa na testnet** (server-side relay zwykłym
HTTPS). Serwer LP jest pośrednikiem → ukrywa IP kupującego przed węzłem/indekserem.
Pełne OHTTP (jak w aplikacji mobilnej) to TODO przed mainnetem — patrz koniec sekcji.

### 4a. Konfiguracja (`.env.local`)

*Adresy backendów, do których pośredniczą route handlery.*

```bash
# Algod (testnet, publiczny — bez tokenu)
ALGOD_URL=https://testnet-api.algonode.cloud
# Sealed indexer — tu żyje /delivery/:hex (Pi + Tailscale Funnel)
SEALED_INDEXER_URL=https://sealed-pi.taile8602b.ts.net
```

Po stronie Sealed indexera musi być ustawione `PREIMAGE_UPSTREAM_URL` (wskazuje na
preimage-server), inaczej `/delivery/:hex` zwraca 404. To konfiguracja operatora
indexera, nie LP.

### 4b. Route OHTTP Proxy algod — `src/app/api/algod/[...path]/route.ts`

*Przekazuje wszystkie wywołania algosdk (odczyt globali/boxów, params, submit) do węzła — jeden proxy na cały algod.*

Obsługuje też ciało binarne (submit transakcji).

```ts
import { NextRequest } from 'next/server';

const ALGOD = process.env.ALGOD_URL ?? 'https://testnet-api.algonode.cloud';

// Przekazuje pojedyncze żądanie do węzła algod, zachowując metodę, ścieżkę i ciało.
async function proxy(req: NextRequest, path: string[]): Promise<Response> {
  const url = `${ALGOD}/${path.join('/')}${req.nextUrl.search}`;
  const init: RequestInit = {
    method: req.method,
    headers: { 'content-type': req.headers.get('content-type') ?? 'application/json' },
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = Buffer.from(await req.arrayBuffer()); // submit = surowe bajty
  }
  const res = await fetch(url, init);
  return new Response(res.body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}

// Wejścia route handlera — odczyty (GET) i submit/params (POST).
export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
```

### 4c. Route OHTTP Proxy dostawy — `src/app/api/delivery/[hex]/route.ts`

*Przekazuje pobranie zaszyfrowanej paczki do Sealed indexera i zwraca surowe bajty kupującemu.*

```ts
import { NextRequest } from 'next/server';

const INDEXER = process.env.SEALED_INDEXER_URL ?? 'https://sealed-pi.taile8602b.ts.net';

// Waliduje klucz (64 hex) i strumieniuje ciphertext z /delivery/:hex indexera.
export async function GET(_req: NextRequest, ctx: { params: Promise<{ hex: string }> }) {
  const { hex } = await ctx.params;
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    return new Response('not found', { status: 404 });
  }
  const res = await fetch(`${INDEXER}/delivery/${hex}`, { cache: 'no-store' });
  return new Response(res.body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
      'cache-control': 'no-store',
    },
  });
}
```

To wystarczy, by cały przepływ działał na testnecie end-to-end.

### 4d. TODO przed mainnetem — pełne OHTTP

*Docelowo oba proxy owijają żądanie w OHTTP, by nawet relay/gateway nie powiązały kupującego z zapytaniem.*

Wariant powyżej ukrywa IP kupującego (serwer LP pośredniczy), ale relay/gateway nie
są użyte. Docelowo oba route handlery owijają żądanie w OHTTP — te same parametry co
aplikacja mobilna (`sealed_app/lib/core/constants.dart`):

| Cel | Relay | Gateway config | Target |
|---|---|---|---|
| algod | `relay.oblivious.network/great-apple-60` | `ohttp.nodely.io/ohttp-configs` | `testnet-api.4160.nodely.dev` |
| Sealed indexer (`/delivery`) | `relay.oblivious.network/groovy-guide-67` | `sealed-pi…/ohttp-configs` (path `/gateway`) | `sealed-pi.taile8602b.ts.net` |

Wymaga enkapsulatora OHTTP w TS (HPKE pakuje całe żądanie HTTP) — w aplikacji
mobilnej to `OhttpClient`/`OhttpEncapsulator` (Dart). Nie jest potrzebny do
uruchomienia na testnecie; dorób przed produkcją.

---

## Weryfikacja deszyfrowania (test jednostkowy)

Wklej ten wektor do testu po swojej stronie. Jeśli `decryptDelivery` nie odszyfruje
poniższych bajtów do oczekiwanego tekstu — Twoja konstrukcja HPKE jest niezgodna
(zła wersja bajtu, `info` albo układ „wire”) i nie odszyfrujesz realnych dostaw.
Ładunek jest syntetyczny (kod fikcyjny) — bezpieczny do umieszczenia w repo.

```ts
// klucz prywatny (hex):
//   f3aab5bc85496ec7b61303a544bbb941a858a4e1d8afdbfc26ada12bae089d4f
// wire (hex):
//   01b340118e55830d22d3b2924b2e12a5cce6fb329a011181d8c446634751b4b9
//   3bc3cac573c0ffb250be31f7d281b6ecaa36fccad03ee8d344ba63c4871fea4e
//   df71f1d4832b1523a807b3c8b2c2860a0d1ed46d7da6f61145e4421f84228e3f
//   493556a30c42698c05a82765
// oczekiwany wynik:
//   { codes: ["0123-4567-89AB-CDEF"], purchasedAtRound: "1000" }
```
