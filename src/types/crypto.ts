export type CryptoAsset = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  price: number;
  change24h: number;
  isFavorite?: boolean;
  isHidden?: boolean;
};
