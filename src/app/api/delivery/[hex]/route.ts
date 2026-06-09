import { NextRequest } from "next/server";
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

// Waliduje klucz (64 hex) i pobiera ciphertext z /delivery/:hex przez OHTTP.
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ hex: string }> },
) {
  const { hex } = await ctx.params;
  if (!/^[0-9a-f]{64}$/.test(hex))
    return new Response("not found", { status: 404 });
  const res = await ohttp.send({
    method: "GET",
    url: `${TARGET}/delivery/${hex}`,
    headers: {},
    body: Buffer.alloc(0),
  });
  //@ts-expect-error test
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": "application/octet-stream",
      "cache-control": "no-store",
    },
  });
}
