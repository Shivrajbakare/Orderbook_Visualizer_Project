# Real-Time Order Book Visualizer (Next.js + TypeScript)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://orderbook-visualizer-project.vercel.app/)

A high-performance live order book visualizer using the **Binance WebSocket API**:
- Depth deltas: `@depth@100ms` with **correct snapshot bootstrap** and **sequence checks**
- Aggregate trades: `@aggTrade` with direction-based highlighting
- O(1) updates via Maps, memoized rows, and batched recomputations

## Stack
- Next.js 14 (App Router), TypeScript
- Zustand for state management
- CSS Modules for styling

## Local Run
```bash
npm install
npm run dev
# open http://localhost:3000
