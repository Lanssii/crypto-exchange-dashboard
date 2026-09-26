import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import { CRYPTO_CONFIG } from "./data/cryptoConfig.ts";

export type NotificationItem = {
  id: string;
  symbol: string;
  percentChange: number;
  direction: "increased" | "decreased";
  time: string;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // show graph for searched coin
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (query.trim() !== "") {
      const q = query.toLowerCase().trim();
      const matches = CRYPTO_CONFIG.filter((asset) => {
        const matchName = asset.name.toLowerCase().includes(q);
        const matchSymbol = asset.symbol.toLowerCase().includes(q);
        const matchBase = asset.baseAsset.toLowerCase().includes(q);
        return matchName || matchSymbol || matchBase;
      });

      if (matches.length === 1) {
        setSelectedSymbol(matches[0].symbol);
      }
    }
  };

  const handleAddNotification = (item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev].slice(0, 10));
    setUnreadCount((prev) => prev + 1);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleOpenNotifications = () => {
    setUnreadCount(0); // Reset notifications after oppening
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        notifications={notifications}
        unreadCount={unreadCount}
        onClearNotifications={handleClearNotifications}
        onOpenNotifications={handleOpenNotifications}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
              onAddNotification={handleAddNotification}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
