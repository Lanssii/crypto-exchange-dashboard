import { CRYPTO_CONFIG } from "../data/cryptoConfig.ts";
import { AssetsTable } from "../components/dashboard/AssetsTable";
import { MarketOverview } from "../components/dashboard/MarketOverview";
import { CurrencyCalculator } from "../components/dashboard/CurrencyCalculator";
import { PriceAlerts } from "../components/dashboard/PriceAlerts";
import { useBinanceWebSocket } from "../hooks/useBinanceWebSocket";
import { useLocalStorage } from "../hooks/useLocalStorage";

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

type HomeProps = {
  searchQuery?: string;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onAddNotification?: (item: any) => void;
};

const Home = ({
  searchQuery = "",
  selectedSymbol,
  onSelectSymbol,
  onAddNotification,
}: HomeProps) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "crypto_favorites",
    []
  );
  const [hidden, setHidden] = useLocalStorage<string[]>("crypto_hidden", []);

  const { assets, connectionStatus, initialPrices, priceHistory } =
    useBinanceWebSocket(CRYPTO_CONFIG);

  const selectedAsset = assets.find((a) => a.symbol === selectedSymbol);
  const selectedHistory = priceHistory[selectedSymbol] || [];

  const handleToggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleToggleHide = (symbol: string) => {
    setHidden((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

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
      {/* Status Bar */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <div>{renderConnectionBadge()}</div>
      </div>

      {/* 2% Price Alerts Container */}
      <PriceAlerts
        assets={assets}
        initialPrices={initialPrices}
        onAddNotification={onAddNotification}
      />

      {/* Graph and Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
        <MarketOverview asset={selectedAsset} history={selectedHistory} />
        <CurrencyCalculator assets={assets} />
      </div>

      {/* Assets Table */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <AssetsTable
          assets={assets}
          priceHistory={priceHistory}
          selectedSymbol={selectedSymbol}
          searchQuery={searchQuery}
          favorites={favorites}
          hidden={hidden}
          onSelectSymbol={onSelectSymbol}
          onToggleFavorite={handleToggleFavorite}
          onToggleHide={handleToggleHide}
        />
      </div>
    </main>
  );
};

export default Home;
