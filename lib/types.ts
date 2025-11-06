export type DepthUpdate = {
  U: number;
  u: number;
  b: [number, number][];
  a: [number, number][];
};

export type Trade = {
  id: number;
  price: number;
  qty: number;
  time: number;
  side: "buy" | "sell";
  just?: boolean;
};
