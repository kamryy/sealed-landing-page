import { NextRequest } from "next/server";
import { createOhttpClient } from "@/lib/ohttp/ohttp-client";

export const runtime = "nodejs"; // node:crypto — NIE edge

const TARGET = process.env.ALGOD_OHTTP_TARGET!;
const RELAY = process.env.ALGOD_OHTTP_RELAY!;
const GATEWAY_CONFIG = process.env.ALGOD_OHTTP_GATEWAY_CONFIG!;

// Key-config bramy jest stabilny — pobierz raz na proces i trzymaj w cache.
let cfg: Promise<Buffer> | null = null;
const keyConfigFetcher = () =>
  (cfg ??= fetch(GATEWAY_CONFIG).then(async (r) =>
    Buffer.from(await r.arrayBuffer()),
  ));

const ohttp = createOhttpClient({ relayUrl: RELAY, keyConfigFetcher });

// Owija pojedyncze żądanie algod w OHTTP i zwraca odpowiedź.
async function proxy(req: NextRequest, path: string[]): Promise<Response> {
  const url = `${TARGET}/${path.join("/")}${req.nextUrl.search}`;
  const body =
    req.method === "GET" || req.method === "HEAD"
      ? Buffer.alloc(0)
      : Buffer.from(await req.arrayBuffer());
  const res = await ohttp.send({
    method: req.method as "GET" | "POST",
    url,
    headers: {
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body,
  });
  //@ts-expect-error test
  return new Response(res.body, { status: res.status });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}
