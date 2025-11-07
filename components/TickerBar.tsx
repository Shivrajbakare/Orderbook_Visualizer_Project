"use client";

import { useOrderBookStore } from "@/store/orderBookStore";
import { useEffect, useRef } from "react";
import styles from "./TickerBar.module.css";

export default function TickerBar() {
  const trades = useOrderBookStore((s) => s.trades);
  const containerRef = useRef<HTMLDivElement>(null);

  const latestTrades = trades.slice(0, 30); // last 30 trades

  // Auto scroll effect
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [trades]);

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.ticker} ref={containerRef}>
        {latestTrades.map((t, i) => (
          <span
            key={i}
            className={`${styles.item} ${
              t.side === "buy" ? styles.green : styles.red
            }`}
          >
            {new Date(t.time).toLocaleTimeString()} — {t.price.toFixed(2)} ({t.qty})
          </span>
        ))}
      </div>
    </div>
  );
}
