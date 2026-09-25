export type PriceDirection = "up" | "down" | "neutral";

export type CryptoAsset = {
  symbol: string; // "BTCUSDT"
  baseAsset: string; // "BTC"
  quoteAsset: string; // "USDT"
  name: string; // "Bitcoin"
  icon?: string;
  price: number | null;
  change24h: number | null;
  priceDirection?: PriceDirection;
  isFavorite?: boolean;
  isHidden?: boolean;
};
