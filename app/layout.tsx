import "./globals.css";

export const metadata = {
  title: "Real-Time Order Book Visualizer",
  description: "Live Binance WebSocket Order Book + Trades",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
