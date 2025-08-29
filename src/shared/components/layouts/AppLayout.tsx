import { AnimatePresence } from "framer-motion";
import { Bell, Eye } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { formatChatsforUi } from "../../../pages/Chats/utils/utils";
import { useApp } from "../../contexts/AppContext";
import { useChats } from "../../hooks/useChats";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { db } from "../../services/db";
import { logger } from "../../utils/logger";
import PostViewPanel from "../PostViewPanel";
import BurgerMenu from "./BurgerMenu";

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(appContainerRef);
  const location = useLocation();
  const { chatId } = useParams();
  const { dispatch, state } = useApp();
  const { conversations, fetchChats } = useChats();

  const isSettingsPage = location.pathname.includes("/settings");

  // Détecter si nous sommes sur une page de chat
  const isChatPage = location.pathname.includes("/chats/") && chatId;

  // Trouver le chat actuel et son post associé
  const currentChat = conversations.find((chat) => chat.id === chatId);
  const associatedPostId = currentChat?.associatedPostId;

  // Condition pour afficher le bouton : page de chat ET post associé
  const shouldShowPostButton = isChatPage && associatedPostId;

  // Charger les chats pour obtenir les données du chat actuel
  useEffect(() => {
    const loadChats = async () => {
      if (isChatPage && state.currentCompany?.id) {
        try {
          const userChats = await db.getAllChats(state.currentCompany.id);
          const userChatsFormated = formatChatsforUi(userChats);
          fetchChats(userChatsFormated);
        } catch (err) {
          logger.error("Failed to load chats for mobile header", err);
        }
      }
    };

    loadChats();
  }, [isChatPage, state.currentCompany?.id, chatId]);

  const handleViewPost = () => {
    if (associatedPostId) {
      dispatch({ type: "OPEN_POST_PANEL", payload: associatedPostId });
    }
  };

  return (
    <div
      className="grid-cols-1 md:grid-cols-[290px_1fr] md:grid-rows-[auto_1fr] min-h-screen bg-[#E7E9F2] grid"
      ref={appContainerRef}
    >
      {/* Mobile Header */}
      <header className="md:col-[2_/_3] md:hidden flex items-center justify-between px-4 h-16 fixed top-0 z-50 bg-[#E7E9F2] w-full border-b border-[rgb(0,0,0,.4)]">
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
          {/* Bouton pour voir le post associé - Seulement en mobile et si conditions remplies */}
          {shouldShowPostButton && (
            <button
              onClick={handleViewPost}
              className="p-2 hover:bg-[#E7E9F2] rounded-full relative"
              title="Voir le post associé"
            >
              <Eye className="w-5 text-[#7C3AED]" />
            </button>
          )}

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

      {/* Post View Panel */}
      <PostViewPanel />

      {/* Main Content Area */}
      <main
        className={`md:col-[2_/_3] flex flex-col h-screen overflow-y-auto custom-scrollbar pt-16 md:pt-0 ${
          isSettingsPage && "overflow-x-auto"
        }`}
      >
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
