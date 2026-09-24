import { useState } from "react";
import { INITIAL_ASSETS } from "../data/mockData";
import { AssetsTable } from "../components/dashboard/AssetsTable";

const Home = () => {
  // Save selected currency
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* check is click on currency is working */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          Selected Currency:{" "}
          <span className="font-bold text-[#592357]">{selectedSymbol}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Graph will be there</p>
      </div>

      {/* Наша таблица с моковыми валютами */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <AssetsTable
          assets={INITIAL_ASSETS}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
        />
      </div>
    </main>
  );
};

export default Home;
