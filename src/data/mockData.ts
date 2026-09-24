import type { CryptoAsset } from "../types/crypto";

export const INITIAL_ASSETS: CryptoAsset[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    name: "Bitcoin",
    price: 84312.5,
    change24h: 2.14,
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    name: "Ethereum",
    price: 3412.1,
    change24h: -0.85,
  },
  {
    symbol: "SOLUSDT",
    baseAsset: "SOL",
    quoteAsset: "USDT",
    name: "Solana",
    price: 185.4,
    change24h: 5.3,
  },
  {
    symbol: "BNBUSDT",
    baseAsset: "BNB",
    quoteAsset: "USDT",
    name: "BNB",
    price: 580.2,
    change24h: 0.12,
  },
  {
    symbol: "XRPUSDT",
    baseAsset: "XRP",
    quoteAsset: "USDT",
    name: "XRP",
    price: 0.58,
    change24h: -1.2,
  },
];
