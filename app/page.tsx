"use client";

import { useEffect, useMemo, useState } from "react";
import OrderBook from "@/components/OrderBook";
import RecentTrades from "@/components/RecentTrades";
import Spread from "@/components/Spread";
import useBinanceSocket from "@/hooks/useBinanceSocket";
import { useOrderBookStore } from "@/store/orderBookStore";

export default function Page() {
  const [symbol, setSymbol] = useState("btcusdt");
  const { status, error, setSymbol: changeSymbol } = useBinanceSocket();
  const { bidsSorted, asksSorted, cumulativeBids, cumulativeAsks, topBid, topAsk } =
    useOrderBookStore();

  useEffect(() => {
    changeSymbol(symbol);
  }, [symbol]);

  const spread = useMemo(
    () => (topBid && topAsk ? topAsk - topBid : null),
    [topBid, topAsk]
  );

  return (
    <div className="p-4 space-y-4 text-white">
      <h1 className="text-xl font-bold">Live OrderBook — {symbol.toUpperCase()}</h1>

      <input
        className="bg-black/60 border border-gray-700 px-2 py-1 rounded"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toLowerCase())}
      />

      <div className="grid grid-cols-3 gap-2">
        <OrderBook side="bids" rows={bidsSorted} cumulative={cumulativeBids} title="Bids" color="green" />
        <Spread topBid={topBid} topAsk={topAsk} spread={spread} />
        <OrderBook side="asks" rows={asksSorted} cumulative={cumulativeAsks} title="Asks" color="red" />
      </div>

      <RecentTrades />

      <div className="text-sm opacity-70">Status: {status} {error && ` | Error: ${error}`}</div>
    </div>
  );
}
