import type { CryptoAsset } from "../../types/crypto";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type AssetRowProps = {
  asset: CryptoAsset;
  isSelected: boolean;
  onSelect: (symbol: string) => void;
  onToggleFavorite?: (symbol: string) => void;
  onToggleHide?: (symbol: string) => void;
};

export const AssetRow = ({
  asset,
  isSelected,
  onSelect,
  onToggleFavorite,
  onToggleHide,
}: AssetRowProps) => {
  const isPositive = asset.change24h >= 0;

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
        {/* Favorites */}
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

        {/* Avatar */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200">
          {asset.baseAsset.slice(0, 3)}
        </div>

        {/* Name */}
        <div className="truncate">
          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
            {asset.name}
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
            {asset.baseAsset}
          </p>
        </div>
      </div>

      {/* Temporary Mini Graph (before real one)*/}
      <div className="hidden md:block w-24 lg:w-28 h-8 flex-shrink-0 mx-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
          <path
            d={
              isPositive
                ? "M 0 20 Q 25 25, 50 10 T 100 5"
                : "M 0 5 Q 25 10, 50 25 T 100 28"
            }
            fill="none"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 text-right">
        {/* Price */}
        <div className="min-w-[80px] sm:min-w-[100px]">
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm font-mono">
            $
            {asset.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="hidden sm:block text-[10px] sm:text-xs text-gray-400 font-mono">
            {(asset.price * 0.01).toFixed(3)} {asset.baseAsset}
          </div>
        </div>

        {/* Price Chanching in % */}
        <div className="min-w-[70px] sm:min-w-[80px] flex justify-end">
          <div
            className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold font-mono ${
              isPositive
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            <span className="text-sm">{isPositive ? "↗" : "↘"}</span>
            <span>{Math.abs(asset.change24h)}%</span>
          </div>
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
