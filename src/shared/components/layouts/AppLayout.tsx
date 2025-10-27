import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import BurgerMenu from "./BurgerMenu";

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(appContainerRef);
  const location = useLocation();

  const isSettingsPage = location.pathname.includes("/settings");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className="grid-cols-1 md:grid-cols-[290px_1fr] md:grid-rows-[auto_1fr] min-h-screen bg-[#E7E9F2] grid"
      ref={appContainerRef}
    >
      {/* Burger Menu */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        appDimensions={dimensions}
      />

      {/* Main Content Area */}
      <main
        className={`md:col-[2_/_3] flex flex-col h-screen overflow-y-auto custom-scrollbar md:pt-0 ${
          isSettingsPage && "overflow-x-auto"
        }`}
      >
        <AnimatePresence mode="wait">
          <Outlet context={{ toggleMenu }} />
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
