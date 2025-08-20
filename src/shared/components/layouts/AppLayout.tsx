import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import React, { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import HeaderActionButton from "../HeaderActionButton";
import BurgerMenu from "./BurgerMenu";

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(appContainerRef);
  const location = useLocation();

  // Extract type and ID from current path for FAB
  const getFABProps = () => {
    const path = location.pathname;

    // Match /posts/:id pattern
    const postMatch = path.match(/^\/posts\/([^\/]+)$/);
    if (postMatch) {
      return { type: "post" as const, id: postMatch[1] };
    }

    // Match /chats/:id pattern
    const chatMatch = path.match(/^\/chats\/([^\/]+)$/);
    if (chatMatch) {
      return { type: "chat" as const, id: chatMatch[1] };
    }

    return null;
  };

  const fabProps = getFABProps();

  return (
    <div
      className="grid-cols-1 md:grid-cols-[290px_1fr] md:grid-rows-[auto_1fr] min-h-screen bg-[#E7E9F2] grid"
      ref={appContainerRef}
    >
      {/* Mobile Header */}
      <header className="md:col-[2_/_3] md:hidden flex items-center justify-between px-4 h-16 sticky top-0 z-50 bg-[#E7E9F2] w-full border-b border-[rgb(0,0,0,.4)]">
        <div className="flex items-center space-x-2">
          {dimensions && dimensions.width < 768 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p2 hover:bg-[#E7E9F2] rounded-full"
            >
              <img src="/assets/align-center.svg" alt="Menu" className="w-9" />
            </button>
          )}
          <img src="/assets/nessia_title.svg" alt="Nessia" className="" />
        </div>

        <div className="flex items-center space-x-2">
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
      </header>

      {/* Burger Menu */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        appDimensions={dimensions}
      />
      {/* Main Content Area */}
      <main className="flex-1 md:col-[2_/_3] overflow-auto translate-y-0">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
