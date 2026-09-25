import type { CryptoAsset } from "../../types/crypto";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type AssetRowProps = {
  asset: CryptoAsset;
  history?: number[];
  isSelected: boolean;
  onSelect: (symbol: string) => void;
  onToggleFavorite?: (symbol: string) => void;
  onToggleHide?: (symbol: string) => void;
};

export const AssetRow = ({
  asset,
  history = [],
  isSelected,
  onSelect,
  onToggleFavorite,
  onToggleHide,
}: AssetRowProps) => {
  const isPositive24h = (asset.change24h ?? 0) >= 0;

  const generateSparklinePath = () => {
    if (history.length < 2) return "";
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    const width = 100;
    const height = 30;

    const points = history.map((price, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((price - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div
      onClick={() => onSelect(asset.symbol)}
      className={`group flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all cursor-pointer border ${
        isSelected
          ? "bg-purple-50/30 border-[#2D122C]/40 dark:bg-[#170916]/40 dark:border-[#2D122C]/30"
          : "bg-white border-gray-100 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800/60 dark:hover:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(asset.symbol);
          }}
          className={`text-base sm:text-lg transition-colors p-1 ${
            asset.isFavorite
              ? "text-yellow-400"
              : "text-gray-300 hover:text-gray-400 dark:text-gray-600"
          }`}
          title="Toggle Favorite"
        >
          ★
        </button>

        {/* Currency Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200 overflow-hidden p-1.5">
          {asset.icon ? (
            <img
              src={asset.icon}
              alt={asset.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            asset.baseAsset.slice(0, 3)
          )}
        </div>

        <div className="truncate">
          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
            {asset.name}
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
            {asset.baseAsset}
          </p>
        </div>
      </div>

      {/* Real Dynamic Mini Graph */}
      <div className="hidden md:block w-24 lg:w-28 h-8 flex-shrink-0 mx-2">
        {history.length >= 1 ? (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
            <path
              d={generateSparklinePath() || "M 0 15 L 100 15"}
              fill="none"
              stroke={isPositive24h ? "#22c55e" : "#ef4444"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 italic">
            Connecting...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 text-right">
        <div className="min-w-[80px] sm:min-w-[100px]">
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm font-mono">
            {asset.price !== null ? (
              `$${asset.price.toLocaleString(undefined, {
                minimumFractionDigits: asset.price < 1 ? 4 : 2,
              })}`
            ) : (
              <span className="text-gray-400 font-normal animate-pulse">
                Loading...
              </span>
            )}
          </div>
        </div>

        {/* Real-time Tick Direction and 24h Change */}
        <div className="min-w-[70px] sm:min-w-[80px] flex justify-end">
          {asset.change24h !== null ? (
            <div
              className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold font-mono ${
                isPositive24h
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              <span className="text-sm">
                {asset.priceDirection === "up"
                  ? "↑"
                  : asset.priceDirection === "down"
                  ? "↓"
                  : isPositive24h
                  ? "↗"
                  : "↘"}
              </span>
              <span>{Math.abs(asset.change24h)}%</span>
            </div>
          ) : (
            <span className="text-gray-300 text-xs">--</span>
          )}
        </div>

        {/* Hide Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleHide?.(asset.symbol);
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-opacity p-1"
          title="Hide Currency"
        >
          {asset.isHidden ? (
            <AiOutlineEyeInvisible size={18} />
          ) : (
            <AiOutlineEye size={18} />
          )}
        </button>
      </div>
    </div>
  );
};
