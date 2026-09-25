import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";

export type NotificationItem = {
  id: string;
  symbol: string;
  percentChange: number;
  direction: "increased" | "decreased";
  time: string;
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Adding new alert in history (max 10 elements)
  const handleAddNotification = (item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev].slice(0, 10));
    setUnreadCount((prev) => prev + 1);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleOpenNotifications = () => {
    setUnreadCount(0); // Reset after oppening
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
              onAddNotification={handleAddNotification}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
