import { useState, useMemo } from "react";
import type { CryptoAsset } from "../../types/crypto";
import { AssetRow } from "./AssetRow";
import { FiFilter } from "react-icons/fi";

type SortOption = "name" | "price" | "change";
type TabType = "all" | "favorites" | "hidden";

type AssetsTableProps = {
  assets: CryptoAsset[];
  priceHistory?: Record<string, number[]>;
  selectedSymbol: string;
  searchQuery: string;
  favorites: string[];
  hidden: string[];
  onSelectSymbol: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
  onToggleHide: (symbol: string) => void;
};

export const AssetsTable = ({
  assets,
  priceHistory = {},
  selectedSymbol,
  searchQuery,
  favorites,
  hidden,
  onSelectSymbol,
  onToggleFavorite,
  onToggleHide,
}: AssetsTableProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // asset filtering and sorting
  const processedAssets = useMemo(() => {
    return assets
      .map((asset) => ({
        ...asset,
        isFavorite: favorites.includes(asset.symbol),
        isHidden: hidden.includes(asset.symbol),
      }))
      .filter((asset) => {
        // Tab Filtering Logic
        if (activeTab === "hidden") {
          if (!asset.isHidden) return false;
        } else {
          if (asset.isHidden) return false; // Exclude hidden from All & Favorites
          if (activeTab === "favorites" && !asset.isFavorite) return false;
        }

        // Global Search Filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchName = asset.name.toLowerCase().includes(q);
          const matchSymbol = asset.symbol.toLowerCase().includes(q);
          const matchBase = asset.baseAsset.toLowerCase().includes(q);

          // Match numerical price string
          const priceStr = asset.price !== null ? asset.price.toString() : "";
          const matchPrice = priceStr.includes(q);

          return matchName || matchSymbol || matchBase || matchPrice;
        }

        return true;
      })
      .sort((a, b) => {
        const modifier = sortOrder === "asc" ? 1 : -1;
        if (sortBy === "name") {
          return a.name.localeCompare(b.name) * modifier;
        }
        if (sortBy === "price") {
          return ((a.price ?? 0) - (b.price ?? 0)) * modifier;
        }
        if (sortBy === "change") {
          return ((a.change24h ?? 0) - (b.change24h ?? 0)) * modifier;
        }
        return 0;
      });
  }, [assets, favorites, hidden, activeTab, searchQuery, sortBy, sortOrder]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tabs and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab("all")}
            className={`transition-colors ${
              activeTab === "all"
                ? "text-gray-900 font-bold dark:text-white border-b-2 border-[#592357] dark:border-purple-400 pb-0.5"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`transition-colors ${
              activeTab === "favorites"
                ? "text-gray-900 font-bold dark:text-white border-b-2 border-[#592357] dark:border-purple-400 pb-0.5"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Favorites ({favorites.length})
          </button>

          <button
            onClick={() => setActiveTab("hidden")}
            className={`transition-colors ${
              activeTab === "hidden"
                ? "text-gray-900 font-bold dark:text-white border-b-2 border-[#592357] dark:border-purple-400 pb-0.5"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Hidden ({hidden.length})
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800 text-xs text-gray-500 font-medium">
            <FiFilter className="text-gray-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800 text-xs font-mono font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle Sort Direction"
          >
            {sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}
          </button>
        </div>
      </div>

      {/* Rendered Asset Rows */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {processedAssets.length > 0 ? (
          processedAssets.map((asset) => (
            <AssetRow
              key={asset.symbol}
              asset={asset}
              history={priceHistory[asset.symbol] || []}
              isSelected={asset.symbol === selectedSymbol}
              onSelect={onSelectSymbol}
              onToggleFavorite={onToggleFavorite}
              onToggleHide={onToggleHide}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs sm:text-sm border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            {activeTab === "hidden"
              ? "No hidden currencies"
              : activeTab === "favorites"
              ? "No favorite currencies selected yet"
              : searchQuery
              ? `No currencies found matching "${searchQuery}"`
              : "No assets available"}
          </div>
        )}
      </div>
    </div>
  );
};
