"use client";

import { useOrderBookStore } from "@/store/orderBookStore";
import { parseDepthUpdate, parseAggTrade } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function useBinanceSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState("");

  const store = useOrderBookStore;
  const [symbol, setSymbolState] = useState("btcusdt");

  const connect = async () => {
    setStatus("connecting");

    // ✅ Get initial snapshot
    let snap;
    try {
      snap = await fetch(
        `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=100`
      ).then((r) => r.json());

      store.getState().applySnapshot(snap);
      store.getState().setLastUpdateId(snap.lastUpdateId);
    } catch (e) {
      setError("Snapshot fetch failed");
      return;
    }

    // ✅ WebSocket streams
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${symbol}@depth20@100ms/${symbol}@aggTrade`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => setStatus("connected");

    socketRef.current.onmessage = (msg) => {
      const { stream, data } = JSON.parse(msg.data);

      if (stream.includes("@depth20")) {
        const update = parseDepthUpdate(data);

        if (!store.getState().hasSnapshot) {
          store.getState().bufferDepth(update);
        } else {
          store.getState().applyDepthUpdateSafe(update);
        }
      }

      if (stream.includes("@aggTrade")) {
        const trade = parseAggTrade(data);
        store.getState().addTrade(trade);
      }
    };

    socketRef.current.onerror = () => {
      setError("WebSocket error");
      setStatus("error");
    };

    socketRef.current.onclose = () => {
      setStatus("disconnected");
      setTimeout(connect, 1500);
    };
  };

  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [symbol]);

  return { status, error, setSymbol: setSymbolState };
}
