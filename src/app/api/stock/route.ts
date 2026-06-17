import { createOhttpClient } from "@/lib/ohttp/ohttp-client";

export const runtime = "nodejs";

const TARGET = process.env.DELIVERY_OHTTP_TARGET!;
const RELAY = process.env.DELIVERY_OHTTP_RELAY!;
const GATEWAY_CONFIG = process.env.DELIVERY_OHTTP_GATEWAY_CONFIG!;

let cfg: Promise<Buffer> | null = null;
const keyConfigFetcher = () =>
  (cfg ??= fetch(GATEWAY_CONFIG).then(async (r) =>
    Buffer.from(await r.arrayBuffer()),
  ));

const ohttp = createOhttpClient({ relayUrl: RELAY, keyConfigFetcher });

// Pobiera dostępny stan kodów ({ available }) z /stock przez OHTTP — LP używa
// tego do sprawdzenia zapasu przed wysłaniem płatności (money-safety).
export async function GET() {
  const res = await ohttp.send({
    method: "GET",
    url: `${TARGET}/stock`,
    headers: {},
    body: Buffer.alloc(0),
  });
  //@ts-expect-error test
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
