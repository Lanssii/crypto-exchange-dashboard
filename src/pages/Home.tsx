import { useState } from "react";
import { INITIAL_ASSETS } from "../data/mockData";
import { AssetsTable } from "../components/dashboard/AssetsTable";
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
  // Currently selected crypto symbol
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  // Fetch real-time crypto prices from Binance WebSocket
  const { assets, connectionStatus } = useBinanceWebSocket(INITIAL_ASSETS);

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
      {/* WebSocket Connection Status */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selected Currency:{" "}
            <span className="font-bold text-[#592357] dark:text-purple-300 font-mono">
              {selectedSymbol}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Interactive chart will be placed here
          </p>
        </div>

        <div>{renderConnectionBadge()}</div>
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
