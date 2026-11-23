import { NextResponse } from "next/server";

const HOSTS = [
  "https://data-api.binance.vision",
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
];
const COINS = ["BTC", "ETH", "BNB", "SOL", "XRP", "DOGE", "TRX", "LTC", "GRAM"];
const WANT = new Set(COINS.map((c) => c + "USDT"));

export async function GET() {
  for (const host of HOSTS) {
    try {
      const res = await fetch(host + "/api/v3/ticker/price", {
        next: { revalidate: 3 },
      });
      if (!res.ok) continue;
      const all: Array<{ symbol: string; price: string }> = await res.json();
      const rows = all.filter((x) => WANT.has(x.symbol));
      if (!rows.length) continue;
      return NextResponse.json(rows, {
        headers: {
          "Cache-Control": "public, max-age=3",
        },
      });
    } catch {
      // try next host
    }
  }
  return NextResponse.json([], { status: 502 });
}
