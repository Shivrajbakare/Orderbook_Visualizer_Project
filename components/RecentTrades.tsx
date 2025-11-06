"use client";

import { useOrderBookStore } from "@/store/orderBookStore";

export default function RecentTrades() {
  const trades = useOrderBookStore((s) => s.trades.slice(0, 50));

  return (
    <div className="bg-[#11151a] p-2 rounded border border-gray-800 max-h-[300px] overflow-auto">
      <div className="font-semibold text-sm opacity-80 mb-2">Recent Trades</div>

      <div className="grid grid-cols-3 text-xs text-gray-400 border-b border-gray-700 pb-1 mb-1">
        <span>Time</span>
        <span className="text-right">Price</span>
        <span className="text-right">Qty</span>
      </div>

      {trades.map((t) => (
        <div
          key={t.id}
          className={`grid grid-cols-3 text-xs py-[2px] ${
            t.side === "buy" ? "text-green-400" : "text-red-400"
          }`}
        >
          <span>{new Date(t.time).toLocaleTimeString()}</span>
          <span className="text-right">{t.price.toFixed(2)}</span>
          <span className="text-right">{t.qty}</span>
        </div>
      ))}
    </div>
  );
}
