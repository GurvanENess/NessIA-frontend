import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { logger } from "../../utils/logger";
import BurgerMenu from "./BurgerMenu";
import Header from "./Header";

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(appContainerRef);
  const location = useLocation();
  const { refreshCurrentCompany } = useApp();
  const { user } = useAuth();

  // Recharger les données de la company (incluant les plateformes) au montage
  useEffect(() => {
    const refreshCompanyData = async () => {
      if (!user?.id) return;

      try {
        await refreshCurrentCompany(user.id);
      } catch (error) {
        logger.error("Failed to refresh company data on mount", error);
        // Erreur silencieuse, les données du localStorage sont toujours disponibles
      }
    };

    refreshCompanyData();
  }, [user?.id]); // Recharger uniquement quand l'utilisateur change

  const isSettingsPage = location.pathname.includes("/settings");
  // Header ne s'affiche pas sur les pages de chat avec un ID (/chats/:chatId)
  const isChatPage = /^\/chats\/[^/]+/.test(location.pathname); // Détecte /chats/{id}

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
        {!isChatPage && <Header onToggleMenu={toggleMenu} />}

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
