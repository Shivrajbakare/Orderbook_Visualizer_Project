"use client";

export default function Spread({
  topBid,
  topAsk,
  spread
}: {
  topBid: number | null;
  topAsk: number | null;
  spread: number | null;
}) {
  const format = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(n);

  return (
    <div className="flex flex-col items-center justify-center bg-[#11151a] p-3 rounded border border-gray-800 text-center">
      <div className="text-gray-400 text-xs">Best Bid</div>
      <div className="text-green-400 font-semibold">{topBid ? format(topBid) : "-"}</div>

      <div className="h-2" />

      <div className="text-gray-400 text-xs">Best Ask</div>
      <div className="text-red-400 font-semibold">{topAsk ? format(topAsk) : "-"}</div>

      <div className="mt-3 pt-2 border-t border-gray-700 text-sm">
        Spread: {spread ? format(spread) : "-"}
      </div>
    </div>
  );
}
