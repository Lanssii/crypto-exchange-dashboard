import type { CryptoAsset } from "../types/crypto";

import btcIcon from "../../public/images/BTC.svg";
import ethIcon from "../../public/images/ETH.svg";
import solIcon from "../../public/images/SOL.svg";
import bnbIcon from "../../public/images/BNB.svg";
import xrpIcon from "../../public/images/XRP.svg";

export const CRYPTO_CONFIG: CryptoAsset[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    name: "Bitcoin",
    icon: btcIcon,
    price: null,
    change24h: null,
    priceDirection: "neutral",
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    name: "Ethereum",
    icon: ethIcon,
    price: null,
    change24h: null,
    priceDirection: "neutral",
  },
  {
    symbol: "SOLUSDT",
    baseAsset: "SOL",
    quoteAsset: "USDT",
    name: "Solana",
    icon: solIcon,
    price: null,
    change24h: null,
    priceDirection: "neutral",
  },
  {
    symbol: "BNBUSDT",
    baseAsset: "BNB",
    quoteAsset: "USDT",
    name: "BNB",
    icon: bnbIcon,
    price: null,
    change24h: null,
    priceDirection: "neutral",
  },
  {
    symbol: "XRPUSDT",
    baseAsset: "XRP",
    quoteAsset: "USDT",
    name: "XRP",
    icon: xrpIcon,
    price: null,
    change24h: null,
    priceDirection: "neutral",
  },
];
