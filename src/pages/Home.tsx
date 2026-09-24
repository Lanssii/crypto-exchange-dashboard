import { useState } from "react";
import { INITIAL_ASSETS } from "../data/mockData";
import { AssetsTable } from "../components/dashboard/AssetsTable";
import { MarketOverview } from "../components/dashboard/MarketOverview";
import { CurrencyCalculator } from "../components/dashboard/CurrencyCalculator";
import { useBinanceWebSocket } from "../hooks/useBinanceWebSocket";

const STATUS_BADGE_CONFIG = {
  CONNECTED: {
    text: "Connected",
    textColor: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  RECONNECTING: {
    text: "Reconnecting...",
    textColor: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  ERROR: {
    text: "Connection Error",
    textColor: "text-rose-600 dark:text-rose-400",
    dotColor: "bg-rose-500",
  },
  DISCONNECTED: {
    text: "Disconnected",
    textColor: "text-gray-500 dark:text-gray-400",
    dotColor: "bg-gray-400",
  },
};

const Home = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  // Fetch real-time crypto prices & session history from Binance WebSocket
  const { assets, connectionStatus, priceHistory } =
    useBinanceWebSocket(INITIAL_ASSETS);

  const selectedAsset = assets.find((a) => a.symbol === selectedSymbol);
  const selectedHistory = priceHistory[selectedSymbol] || [];

  const renderConnectionBadge = () => {
    const config =
      STATUS_BADGE_CONFIG[connectionStatus] || STATUS_BADGE_CONFIG.DISCONNECTED;

    return (
      <div
        className={`inline-flex items-center gap-2 px-1 py-1 text-xs font-semibold ${config.textColor}`}
      >
        <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
        <span>{config.text}</span>
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <div>{renderConnectionBadge()}</div>
      </div>

      {/* Graph and Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
        <MarketOverview asset={selectedAsset} history={selectedHistory} />
        <CurrencyCalculator assets={assets} />
      </div>

      {/* Crypto Assets Table */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <AssetsTable
          assets={assets}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
        />
      </div>
    </main>
  );
};

export default Home;
