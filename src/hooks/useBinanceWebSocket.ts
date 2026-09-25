import { useState, useEffect, useRef } from "react";
import type { CryptoAsset, PriceDirection } from "../types/crypto";

export type ConnectionStatus =
  | "CONNECTED"
  | "RECONNECTING"
  | "DISCONNECTED"
  | "ERROR";

type UseBinanceWebSocketReturn = {
  assets: CryptoAsset[];
  connectionStatus: ConnectionStatus;
  initialPrices: Record<string, number>;
  priceHistory: Record<string, number[]>;
};

export const useBinanceWebSocket = (
  initialAssets: CryptoAsset[]
): UseBinanceWebSocketReturn => {
  const [assets, setAssets] = useState<CryptoAsset[]>(initialAssets);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("DISCONNECTED");

  // Save the initial price of the session (first price received)
  const initialPricesRef = useRef<Record<string, number>>({});
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>(
    {}
  );

  // Store price history in ref to avoid data loss on high-frequency updates
  const priceHistoryRef = useRef<Record<string, number[]>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(
    {}
  );

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      const streams = initialAssets
        .map((a) => `${a.symbol.toLowerCase()}@ticker`)
        .join("/");

      // WebSocket API URL
      const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;

      if (isMounted) {
        setConnectionStatus("RECONNECTING");
      }

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (isMounted) setConnectionStatus("CONNECTED");
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);
          const symbol = data.s;
          const currentPrice = parseFloat(data.c);
          const change24h = parseFloat(data.P);

          if (!symbol || isNaN(currentPrice)) return;

          // Record first price of the session
          if (!(symbol in initialPricesRef.current)) {
            initialPricesRef.current[symbol] = currentPrice;
            setInitialPrices((prev) => ({ ...prev, [symbol]: currentPrice }));
          }

          // Atomically update history in ref
          const currentHistory = priceHistoryRef.current[symbol] || [];
          const updatedHistory = [...currentHistory, currentPrice].slice(-20);
          priceHistoryRef.current[symbol] = updatedHistory;

          setPriceHistory({ ...priceHistoryRef.current });

          // Calculate instant price direction (Comparing with previous tick)
          setAssets((prevAssets) =>
            prevAssets.map((asset) => {
              if (asset.symbol === symbol) {
                const prevPrice = asset.price;
                let direction: PriceDirection = "neutral";

                if (prevPrice !== null) {
                  if (currentPrice > prevPrice) direction = "up";
                  else if (currentPrice < prevPrice) direction = "down";
                  else direction = asset.priceDirection || "neutral";
                }

                return {
                  ...asset,
                  price: currentPrice,
                  change24h: change24h,
                  priceDirection: direction,
                };
              }
              return asset;
            })
          );
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onerror = () => {
        if (isMounted) setConnectionStatus("ERROR");
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnectionStatus("DISCONNECTED");

        // Safe automatic reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          if (isMounted) {
            connect();
          }
        }, 3000);
      };
    };

    connect();

    // Clean up connections and timeouts on unmount
    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    assets,
    connectionStatus,
    initialPrices,
    priceHistory,
  };
};
