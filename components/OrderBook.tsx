"use client";

type Row = { price: number; qty: number };

interface Props {
  side: "bids" | "asks";
  rows: Row[];
  cumulative: number[];
  title: string;
  color: "green" | "red";
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(n);

const formatQty = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(n);

export default function OrderBook({ side, rows, cumulative, title, color }: Props) {
  const maxCum = cumulative.length ? Math.max(...cumulative) : 1;

  return (
    <div className="bg-[#11151a] p-2 rounded border border-gray-800">
      <div className="font-semibold mb-2 text-sm opacity-80">{title}</div>

      <div className="grid grid-cols-3 text-xs text-gray-400 border-b border-gray-700 pb-1 mb-1">
        <span>Price</span>
        <span className="text-center">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="max-h-[350px] overflow-auto space-y-[2px] text-xs">
        {rows.slice(0, 20).map((r, i) => {

          const total: number = cumulative[i] ?? r.qty; // ✅ Fix: fallback safe
          const pct = (total / maxCum) * 100;

          return (
            <div key={side + r.price} className="relative grid grid-cols-3 px-1 py-[1px]">
              <div
                className={`absolute inset-0 opacity-20 ${
                  color === "green" ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${pct}%` }}
              />

              <div className={color === "green" ? "text-green-400" : "text-red-400"}>
                {formatPrice(r.price)}
              </div>
              <div className="text-center">{formatQty(r.qty)}</div>
              <div className="text-right">{formatQty(total)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
