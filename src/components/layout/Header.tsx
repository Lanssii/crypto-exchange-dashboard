import { Link } from "react-router-dom";
import {
  IoNotificationsOutline,
  IoMoonOutline,
  IoSearchOutline,
} from "react-icons/io5";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap md:flex-nowrap items-center justify-between py-3 px-5 gap-y-3">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/images/logoIcon.svg"
              alt="KursiCrypto Logo"
              className="w-8 h-8 object-contain rounded-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              KursiCrypto
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 order-2 md:order-3">
          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <IoNotificationsOutline className="w-6 h-6" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
              aria-hidden="true"
            />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            <IoMoonOutline className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="w-full order-3 md:order-2 md:max-w-xs lg:max-w-md">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
              <IoSearchOutline className="w-5 h-5" />
            </div>

            <input
              type="search"
              id="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full p-2.5 ps-10 pr-4 bg-[#F0F2F4] dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-lg outline-none focus:border-[#592357] focus:ring-2 focus:ring-[#592357]/30 placeholder-gray-500 transition-colors"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
