import { useState, useEffect, useRef } from "react";
import type { CryptoAsset } from "../../types/crypto";
import { IoClose } from "react-icons/io5";

type AlertMessage = {
  id: string;
  symbol: string;
  percentChange: number;
  direction: "increased" | "decreased";
};

type PriceAlertsProps = {
  assets: CryptoAsset[];
  initialPrices: Record<string, number>;
  onAddNotification?: (item: {
    id: string;
    symbol: string;
    percentChange: number;
    direction: "increased" | "decreased";
    time: string;
  }) => void;
};

const ToastItem = ({
  alert,
  onDismiss,
}: {
  alert: AlertMessage;
  onDismiss: (id: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // entry animation
    const showTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // exit animation at 4.6s
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4600);

    // Unmount from state at 5s
    const dismissTimer = setTimeout(() => {
      onDismiss(alert.id);
    }, 5000);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(dismissTimer);
    };
  }, [alert.id, onDismiss]);

  const handleManualClose = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(alert.id), 300);
  };

  const isGreen = alert.direction === "increased";

  return (
    <div
      style={{
        backgroundColor: isGreen ? "#23C552" : "#FF0F0F",
      }}
      className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border border-white/20 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium text-white transition-all duration-300 ease-out transform ${
        isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-8 scale-95"
      }`}
    >
      <span>
        <strong className="font-bold">{alert.symbol}</strong> {alert.direction}{" "}
        by {alert.percentChange}% since you opened the page.
      </span>

      <button
        onClick={handleManualClose}
        className="text-white/80 hover:text-white p-1 transition-colors cursor-pointer flex-shrink-0"
        title="Close"
      >
        <IoClose className="w-4 h-4" />
      </button>
    </div>
  );
};

export const PriceAlerts = ({
  assets,
  initialPrices,
  onAddNotification,
}: PriceAlertsProps) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const triggeredAlertsRef = useRef<Record<string, boolean>>({});

  const pushAlert = (newAlert: AlertMessage) => {
    setAlerts((prev) => [newAlert, ...prev.slice(0, 3)]);

    onAddNotification?.({
      ...newAlert,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  useEffect(() => {
    assets.forEach((asset) => {
      const initPrice = initialPrices[asset.symbol];
      if (!initPrice || asset.price === null) return;

      const currentPrice = asset.price;
      const diff = currentPrice - initPrice;
      const percentChange = (diff / initPrice) * 100;
      const absChange = Math.abs(percentChange);

      const hasTriggered = triggeredAlertsRef.current[asset.symbol];

      if (absChange >= 2.0) {
        if (!hasTriggered) {
          triggeredAlertsRef.current[asset.symbol] = true;

          const newAlert: AlertMessage = {
            id: `${asset.symbol}-${Date.now()}`,
            symbol: asset.symbol,
            percentChange: parseFloat(absChange.toFixed(2)),
            direction: percentChange >= 0 ? "increased" : "decreased",
          };

          pushAlert(newAlert);
        }
      } else {
        if (hasTriggered) {
          triggeredAlertsRef.current[asset.symbol] = false;
        }
      }
    });
  }, [assets, initialPrices]);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  /* UNCOMMENT THESE PARTS TO SEE HOW THESE NOTIFICATIONS WORK
     Not to wait untill 2% changes, for technical interview Demo
  */

  /* const triggerMockAlert = () => {
    const isUp = Math.random() > 0.5;
    const mockPercent = parseFloat((2.15 + Math.random() * 1.2).toFixed(2));

    const testAlert: AlertMessage = {
      id: `test-${Date.now()}`,
      symbol: "BTCUSDT",
      percentChange: mockPercent,
      direction: isUp ? "increased" : "decreased",
    };

    pushAlert(testAlert);
  }; */

  return (
    <>
      {/* 
          DEMO BUTTON 
      */}

      {/* <div className="flex justify-end mb-2">
        <button
          onClick={triggerMockAlert}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#592357] dark:bg-purple-950/60 dark:text-purple-300 font-semibold text-xs transition-all cursor-pointer"
        >
          <span>Test 2% Alert Visual</span>
        </button>
      </div> */}

      {/* Floating Bottom-Right Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
        {alerts.map((alert) => (
          <ToastItem key={alert.id} alert={alert} onDismiss={dismissAlert} />
        ))}
      </div>
    </>
  );
};
