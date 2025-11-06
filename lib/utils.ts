import { DepthUpdate, Trade } from "./types";

// ✅ Parse Binance order book delta messages
export function parseDepthUpdate(d: any) {
  return {
    U: d?.U ?? 0,
    u: d?.u ?? 0,
    b: Array.isArray(d?.b)
      ? d.b.map(([price, qty]: [string, string]) => [parseFloat(price), parseFloat(qty)])
      : [],
    a: Array.isArray(d?.a)
      ? d.a.map(([price, qty]: [string, string]) => [parseFloat(price), parseFloat(qty)])
      : [],
  };
}

// ✅ Parse Binance agg trade message
export const parseAggTrade = (d: any): Trade => ({
  id: d.a,
  price: +d.p,
  qty: +d.q,
  time: d.T,
  side: d.m ? "sell" : "buy",
});
