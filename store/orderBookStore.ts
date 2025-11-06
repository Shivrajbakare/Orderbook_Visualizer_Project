import { create } from "zustand";
import { DepthUpdate, Trade } from "@/lib/types";

type Row = { price: number; qty: number };

type State = {
  bids: Map<number, number>;
  asks: Map<number, number>;
  bidsSorted: Row[];
  asksSorted: Row[];
  cumulativeBids: number[];
  cumulativeAsks: number[];
  topBid: number | null;
  topAsk: number | null;

  lastUpdateId: number | null;
  hasSnapshot: boolean;
  buffer: DepthUpdate[];

  trades: Trade[];

  applySnapshot: (snap: any) => void;
  bufferDepth: (update: DepthUpdate) => void;
  applyBufferedAfterSnapshot: (lastId: number) => void;
  applyDepthUpdateSafe: (update: DepthUpdate) => void;
  setLastUpdateId: (id: number) => void;
  addTrade: (t: Trade) => void;
};

function sortedFrom(map: Map<number, number>, side: "bids" | "asks") {
  const arr: Row[] = [];
  map.forEach((qty, price) => qty > 0 && arr.push({ price, qty }));
  arr.sort((a, b) => (side === "bids" ? b.price - a.price : a.price - b.price));
  return arr;
}

function cumulativeTotals(rows: Row[]) {
  const out: number[] = [];
  let sum = 0;
  for (const r of rows) {
    sum += r.qty;
    out.push(sum);
  }
  return out;
}

function applyDepthToMaps(state: State, u: DepthUpdate) {
  u.b.forEach(([p, q]) => {
    const price = +p;
    const qty = +q;
    qty === 0 ? state.bids.delete(price) : state.bids.set(price, qty);
  });
  u.a.forEach(([p, q]) => {
    const price = +p;
    const qty = +q;
    qty === 0 ? state.asks.delete(price) : state.asks.set(price, qty);
  });
}

export const useOrderBookStore = create<State>((set, get) => ({
  bids: new Map(),
  asks: new Map(),
  bidsSorted: [],
  asksSorted: [],
  cumulativeBids: [],
  cumulativeAsks: [],
  topBid: null,
  topAsk: null,

  lastUpdateId: null,
  hasSnapshot: false,
  buffer: [],

  trades: [],

  applySnapshot: (snap) => {
    const bids = new Map<number, number>();
    const asks = new Map<number, number>();

    snap.bids.forEach(([p, q]: [string, string]) => bids.set(+p, +q));
    snap.asks.forEach(([p, q]: [string, string]) => asks.set(+p, +q));

    const bidsSorted = sortedFrom(bids, "bids");
    const asksSorted = sortedFrom(asks, "asks");

    set({
      bids,
      asks,
      bidsSorted,
      asksSorted,
      cumulativeBids: cumulativeTotals(bidsSorted),
      cumulativeAsks: cumulativeTotals(asksSorted),
      topBid: bidsSorted[0]?.price || null,
      topAsk: asksSorted[0]?.price || null,
    });
  },

  bufferDepth: (u) => set((s) => ({ buffer: [...s.buffer, u] })),

  applyBufferedAfterSnapshot: (lastId) =>
    set((s) => {
      let last = lastId;
      for (const u of s.buffer) {
        if (u.u >= last && u.U <= last + 1 && u.u >= last + 1) {
          applyDepthToMaps(s, u);
          last = u.u;
        }
      }
      const bidsSorted = sortedFrom(s.bids, "bids");
      const asksSorted = sortedFrom(s.asks, "asks");

      return {
        buffer: [],
        lastUpdateId: last,
        bidsSorted,
        asksSorted,
        cumulativeBids: cumulativeTotals(bidsSorted),
        cumulativeAsks: cumulativeTotals(asksSorted),
        topBid: bidsSorted[0]?.price || null,
        topAsk: asksSorted[0]?.price || null,
      };
    }),

  applyDepthUpdateSafe: (u) =>
    set((s) => {
      const last = s.lastUpdateId || 0;
      if (!(u.U <= last + 1 && u.u >= last + 1)) return {};
      applyDepthToMaps(s, u);

      const bidsSorted = sortedFrom(s.bids, "bids");
      const asksSorted = sortedFrom(s.asks, "asks");

      return {
        lastUpdateId: u.u,
        bidsSorted,
        asksSorted,
        cumulativeBids: cumulativeTotals(bidsSorted),
        cumulativeAsks: cumulativeTotals(asksSorted),
        topBid: bidsSorted[0]?.price || null,
        topAsk: asksSorted[0]?.price || null,
      };
    }),

  setLastUpdateId: (id) => set({ lastUpdateId: id }),

  addTrade: (t) =>
  set((s) => ({
    trades: [
      {
        ...t,
        just: true,
        side: t.side as "buy" | "sell", // ✅ force literal type
      },
      ...s.trades.slice(0, 60),
    ],
  })),

}));
