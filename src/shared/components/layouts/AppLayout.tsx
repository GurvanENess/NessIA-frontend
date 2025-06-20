import React, { useState } from "react";
import {
  Bell,
  Info,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import BurgerMenu from "./BurgerMenu";

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-[#E7E9F2] flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 h-16 sticky top-0 z-50 bg-[#E7E9F2] w-full border-b border-[rgb(0,0,0,.4)]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p2 hover:bg-[#E7E9F2] rounded-full"
          >
            <img src="/assets/align-center.svg" alt="Menu" className="w-9" />
          </button>
          <img src="/assets/nessia_title.svg" alt="Nessia" className="" />
        </div>

        <div className="flex items-center">
          <button className="p-2 hover:bg-[#E7E9F2] rounded-full">
            <Info className="w-5 text-[#1A201B]" />
          </button>
          <button
            className="p-2 hover:bg-[#E7E9F2] rounded-full relative"
            onClick={() => {
              setHasNotifications(!hasNotifications);
            }}
          >
            <Bell className="w-5 text-[#1A201B]" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      {/* Burger Menu */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default AppLayout;
