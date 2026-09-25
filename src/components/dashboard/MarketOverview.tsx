import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { CryptoAsset } from "../../types/crypto";

type MarketOverviewProps = {
  asset?: CryptoAsset;
  history: number[];
};

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined || isNaN(price)) return "--";
  return price.toLocaleString(undefined, {
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: 8,
  });
};

export const MarketOverview = ({ asset, history }: MarketOverviewProps) => {
  if (!asset) return null;

  const isPositive = (asset.change24h ?? 0) >= 0;
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";
  const gradientId = `price-gradient-${asset.symbol}`;

  const chartData = history.map((price, index) => ({
    timeLabel: `Tick ${index + 1}`,
    price,
  }));

  // Fallback to null if history is empty and price is not loaded yet
  const sessionHigh = history.length ? Math.max(...history) : asset.price;

  const sessionLow = history.length ? Math.min(...history) : asset.price;

  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {/* Asset Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 font-bold text-base text-gray-800 dark:text-gray-100 overflow-hidden p-1.5">
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

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {asset.name}
              </h2>

              <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-500 dark:bg-gray-800">
                {asset.symbol}
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-gray-400">
              Real-time Session Volatility
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 sm:text-right">
          <div className="hidden border-r border-gray-100 pr-6 md:block dark:border-gray-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Session High
            </span>

            <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
              ${formatPrice(sessionHigh)}
            </span>
          </div>

          <div className="hidden border-r border-gray-100 pr-6 md:block dark:border-gray-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Session Low
            </span>

            <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
              ${formatPrice(sessionLow)}
            </span>
          </div>

          <div>
            <div className="font-mono text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              {asset.price !== null ? (
                `$${formatPrice(asset.price)}`
              ) : (
                <span className="text-gray-400 font-normal text-lg animate-pulse">
                  Loading...
                </span>
              )}
            </div>

            {asset.change24h !== null && (
              <div
                className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                <span>{isPositive ? "↗ +" : "↘ "}</span>
                <span>{asset.change24h}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-64 w-full sm:h-72">
        {history.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={strokeColor}
                    stopOpacity={0.35}
                  />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis dataKey="timeLabel" hide />

              <YAxis
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
                orientation="right"
                tickCount={5}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#9ca3af",
                  fontFamily: "monospace",
                }}
                tickFormatter={(val) => `$${formatPrice(Number(val))}`}
              />

              <Tooltip
                cursor={{
                  stroke: strokeColor,
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const price = Number(payload[0].value);
                  const dataPoint = payload[0].payload;

                  return (
                    <div className="flex flex-col gap-1 rounded-xl border border-gray-700/50 bg-gray-900/90 p-3 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                      <span className="font-sans text-[10px] uppercase text-gray-400">
                        {dataPoint.timeLabel}
                      </span>

                      <span className="text-sm font-bold text-emerald-400">
                        ${formatPrice(price)}
                      </span>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                fillOpacity={1}
                isAnimationActive={false}
                activeDot={{
                  r: 6,
                  fill: strokeColor,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900/50">
            <span className="text-lg">Loading...</span>
            <span>Collecting live WebSocket ticks from Binance...</span>
          </div>
        )}
      </div>
    </section>
  );
};
