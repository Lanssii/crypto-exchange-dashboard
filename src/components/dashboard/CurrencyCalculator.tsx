import { useState } from "react";
import type { CryptoAsset } from "../../types/crypto";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

type CurrencyCalculatorProps = {
  assets: CryptoAsset[];
};

export const CurrencyCalculator = ({ assets }: CurrencyCalculatorProps) => {
  const [fromSymbol, setFromSymbol] = useState("BTCUSDT");
  const [toSymbol, setToSymbol] = useState("ETHUSDT");
  const [amount, setAmount] = useState<string>("0.5");

  // Find dynamic price data for selected currencies
  const fromAsset = assets.find((a) => a.symbol === fromSymbol);
  const toAsset = assets.find((a) => a.symbol === toSymbol);

  // Calculate live conversion result using real-time WebSocket market prices
  const calculateConversion = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || !fromAsset || !toAsset) {
      return 0;
    }
    // (Amount * FromPrice) / ToPrice
    const totalInUsd = numericAmount * fromAsset.price;
    const converted = totalInUsd / toAsset.price;
    return converted;
  };

  // Swap
  const handleSwap = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  // Input validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
      setAmount(val);
    }
  };

  const convertedValue = calculateConversion();

  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6 flex flex-col justify-between gap-2">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Exchange
        </h3>
      </div>

      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* "From" Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              From
            </label>
            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono text-sm font-semibold text-gray-800 outline-none transition-all hover:border-gray-300 focus:border-[#2D122C] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.baseAsset} ({asset.name})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center sm:pt-5">
            <button
              onClick={handleSwap}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-xs transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              title="Swap Currencies"
            >
              <HiOutlineSwitchHorizontal className="text-lg" />
            </button>
          </div>

          {/* "To" Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              To
            </label>
            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono text-sm font-semibold text-gray-800 outline-none transition-all hover:border-gray-300 focus:border-[#2D122C] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.baseAsset} ({asset.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 font-mono text-base font-bold text-gray-900 outline-none transition-all focus:border-[#2D122C] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400"
          />
        </div>

        {/* Result */}
        <div className="mt-1 rounded-xl bg-purple-50/40 p-4 border border-purple-100 dark:border-purple-900/30 dark:bg-[#170916]/30 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Result
          </span>
          <div className="font-mono text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>{amount || "0"}</span>
            <span className="text-xs text-gray-500 font-normal">
              {fromAsset?.baseAsset} =
            </span>
            <span className="text-[#592357] dark:text-purple-300">
              {convertedValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
            <span className="text-xs text-gray-500 font-normal">
              {toAsset?.baseAsset}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
