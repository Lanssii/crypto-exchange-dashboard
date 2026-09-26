import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoNotificationsOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type { NotificationItem } from "../../App";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onClearNotifications: () => void;
  onOpenNotifications: () => void;
  theme: "light" | "dark";
  themeToggle: () => void;
};

const Header = ({
  searchQuery,
  onSearchChange,
  notifications,
  unreadCount,
  onClearNotifications,
  onOpenNotifications,
  theme,
  themeToggle,
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown closing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      onOpenNotifications();
    }
    setIsOpen(!isOpen);
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-xs dark:bg-gray-900 dark:border-gray-800 relative z-50">
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

        {/* Action Buttons and Notifications */}
        <div className="flex items-center gap-2 order-2 md:order-3">
          {/* Notification Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-4 text-xs z-50">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5 mb-2.5">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    Alert Log ({notifications.length})
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Clear log"
                    >
                      <IoTrashOutline />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            {item.direction} by {item.percentChange}%
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          {item.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      No 2% price alerts logged yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
            onClick={themeToggle}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <IoSunnyOutline className="w-6 h-6 text-amber-400" />
            ) : (
              <IoMoonOutline className="w-6 h-6" />
            )}
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
              placeholder="Search by name, symbol, or price..."
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
