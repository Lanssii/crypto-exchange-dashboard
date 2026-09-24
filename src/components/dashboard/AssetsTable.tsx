import { useState } from "react";
import type { CryptoAsset } from "../../types/crypto";
import { AssetRow } from "./AssetRow";

type AssetsTableProps = {
  assets: CryptoAsset[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
};

export const AssetsTable = ({
  assets,
  selectedSymbol,
  onSelectSymbol,
}: AssetsTableProps) => {
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const displayedAssets =
    filter === "favorites" ? assets.filter((a) => a.isFavorite) : assets;

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Filters */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Assets
        </h3>

        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`transition-colors ${
              filter === "all"
                ? "text-gray-900 font-bold dark:text-white border-b-2 border-[#2D122C] pb-0.5"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`transition-colors ${
              filter === "favorites"
                ? "text-gray-900 font-bold dark:text-white border-b-2 border-[#2D122C] pb-0.5"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Favorites
          </button>

          <button className="text-[#2D122C] dark:text-purple-300 hover:underline text-[11px] sm:text-xs">
            See all
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {displayedAssets.length > 0 ? (
          displayedAssets.map((asset) => (
            <AssetRow
              key={asset.symbol}
              asset={asset}
              isSelected={asset.symbol === selectedSymbol}
              onSelect={onSelectSymbol}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs sm:text-sm">
            No assets found in Favorites
          </div>
        )}
      </div>
    </div>
  );
};
