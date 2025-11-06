import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Edit,
  FileText,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatChatsforUi } from "../../../pages/Chats/utils/utils";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useChatModals } from "../../hooks/useChatModals";
import { useChats } from "../../hooks/useChats";
import { db } from "../../services/db";
// Company est maintenant importé via useApp
import { logger } from "../../utils/logger";
import DeleteChatModal from "../DeleteChatModal";
import RenameChatModal from "../RenameChatModal";
import UserAccountDropdown from "../UserAccountDropdown";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  appDimensions: { width: number; height: number } | null;
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  onOpen,
  appDimensions,
}) => {
  const { dispatch, state } = useApp();
  const { user } = useAuth();
  const { conversations, fetchChats } = useChats();
  const { chatId: currentChatId } = useParams();

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showActionsForChatId, setShowActionsForChatId] = useState<
    string | null
  >(null);
  // Utiliser le hook global pour les modales
  const modals = useChatModals();
  // Utiliser les companies du store global au lieu d'un état local
  const {
    state: { companies },
  } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Load recent chats when menu opens
  useEffect(() => {
    const loadRecentChats = async () => {
      if (!isOpen) return;
      try {
        const userChats = await db.getAllChats(
          state.currentCompany?.id as string
        );
        const userChatsFormated = formatChatsforUi(userChats);
        fetchChats(userChatsFormated);
      } catch (err) {
        logger.error("Failed to load recent chats", err);
      }
    };

    loadRecentChats();
  }, [isOpen, state.currentCompany?.id]);

  // Load companies when menu opens
  useEffect(() => {
    const loadCompanies = async () => {
      if (isOpen && companies.length === 0) {
        try {
          const companiesData = await db.getCompaniesByUserId(user?.id!);
          // Mettre à jour le store global avec les companies
          dispatch({ type: "SET_COMPANIES", payload: companiesData });
        } catch (err) {
          logger.error("Failed to load companies", err);
          // Trouver un moyen d'afficher l'erreur à l'utilisateur
        }
      }
    };

    loadCompanies();
  }, [isOpen, user?.id, companies.length, dispatch]);

  // Close actions popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActionsForChatId(null);
      }
    };

    if (showActionsForChatId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsForChatId]);

  const onNewChat = () => {
    dispatch({ type: "RESET_CHAT" });
    if (isMobile) {
      onClose();
    }
  };

  // Force BurgerMenu to be open when width is superior than 768px
  useEffect(() => {
    if (appDimensions && appDimensions.width > 767) {
      onOpen();
      setIsMobile(false);
    }

    if (appDimensions && appDimensions.width <= 767 && !isMobile) {
      onClose();
      setIsMobile(true);
    }
  });

  const menuSections: MenuSection[] = [];

  // Get 5 most recent chats
  const recentChats = conversations
    .filter((chat) => chat.isActive)
    .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
    .slice(0, 10);

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = () => {
    if (!isMobile) return;
    onClose();
  };

  const handleActionsClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionsForChatId(showActionsForChatId === chatId ? null : chatId);
  };

  const handleRename = (chatId: string) => {
    const chat = conversations.find((c) => c.id === chatId);
    if (chat) {
      modals.openRenameModal(chat.id, chat.title);
    }
    setShowActionsForChatId(null);
  };

  const handleDelete = (chatId: string) => {
    const chat = conversations.find((c) => c.id === chatId);
    if (chat) {
      modals.openDeleteModal(chat.id, chat.title);
    }
    setShowActionsForChatId(null);
  };

  // Handlers supprimés - maintenant gérés par le hook global useChatModals

  return (
    <>
      <div
        className={`md:row-span-3 md:col-span-2 md:w-[290px] md:h-screen md:transform-none md:opacity-100 md:pointer-events-auto burger-menu-desktop fixed inset-0 bg-opacity-50 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: -290 }}
          animate={{ x: isOpen ? 0 : -290 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 left-0 h-full bg-white shadow-xl w-[290px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-[65px] p-4 border-b border-gray-100 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  >
                    <img
                      src="/assets/nessia_logo.svg"
                      alt="Nessia"
                      className="w-5 h-5"
                    />
                  </button>
                  <div>
                    <img
                      src="/assets/nessia_title.svg"
                      alt="Nessia"
                      className="h-5 brightness-0 invert"
                    />
                    <p className="text-xs text-purple-100">Assistant IA</p>
                  </div>
                </div>
                {appDimensions && appDimensions.width < 768 && (
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 flex-1 overflow-y-auto">
              {/* Bouton Nouvelle conversation */}
              <Link
                to="/"
                onClick={onNewChat}
                className="flex items-center gap-2 w-full mb-4 px-3 py-2 rounded-lg text-white shadow-md transition-colors bg-[#9B37F1] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#9B37F1] focus:ring-offset-2 text-left"
                style={{ letterSpacing: 0.5 }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Nouvelle conversation</span>
              </Link>

              {/* Main Navigation Links */}
              <div className="space-y-1 mb-6">
                <Link
                  to="/chats"
                  onClick={handleItemClick}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-700 hover:text-[#7C3AED] hover:bg-purple-50 transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                  <span>Discussions</span>
                </Link>

                <Link
                  to="/posts"
                  onClick={handleItemClick}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-700 hover:text-[#7C3AED] hover:bg-purple-50 transition-colors group"
                >
                  <FileText className="w-4 h-4 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                  <span>Posts</span>
                </Link>
              </div>

              {/* Recent Chats Section */}
              {recentChats.length > 0 && (
                <div className="mb-4 mt-8">
                  <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Récents
                  </h3>
                  <div className="space-y-1">
                    {recentChats.map((chat) => (
                      <div key={chat.id} className="relative">
                        <Link
                          to={`/chats/${chat.id}`}
                          onClick={handleItemClick}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                            currentChatId === chat.id
                              ? "bg-purple-100 text-[#7C3AED] font-medium"
                              : "text-gray-600 hover:text-[#7C3AED] hover:bg-purple-50"
                          }`}
                        >
                          <MessageCircle
                            className={`w-4 h-4 transition-colors flex-shrink-0 ${
                              currentChatId === chat.id
                                ? "text-[#7C3AED]"
                                : "text-gray-400 group-hover:text-[#7C3AED]"
                            }`}
                          />
                          <span className="text-sm truncate flex-1">
                            {truncateTitle(chat.title)}
                          </span>
                          {currentChatId === chat.id && (
                            <button
                              onClick={(e) => handleActionsClick(e, chat.id)}
                              className="p-1 hover:bg-purple-200 rounded-full transition-colors opacity-70 hover:opacity-100"
                            >
                              <MoreHorizontal className="w-3 h-3 text-[#7C3AED]" />
                            </button>
                          )}
                        </Link>

                        {/* Actions Popup */}
                        <AnimatePresence>
                          {showActionsForChatId === chat.id && (
                            <motion.div
                              ref={actionsRef}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleRename(chat.id)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                Renommer
                              </button>
                              <button
                                onClick={() => handleDelete(chat.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 className="w-3 h-2" />
                                Supprimer
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {menuSections.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  const SectionIcon = section.icon;

                  return (
                    <div key={section.id} className="space-y-1">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <SectionIcon className="w-5 h-5 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </button>

                      {/* Section Items */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-8 space-y-1 border-l-2 border-gray-100 pl-4">
                              {section.items.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleItemClick}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-[#7C3AED] hover:bg-purple-50 rounded-lg transition-colors group"
                                  >
                                    <ItemIcon className="w-4 h-4 group-hover:text-[#7C3AED] transition-colors" />
                                    <span className="text-sm">
                                      {item.label}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Footer - Always at bottom */}
            <div className="mt-auto">
              <UserAccountDropdown companies={companies} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {modals.selectedChat && (
        <>
          <RenameChatModal
            isOpen={modals.isRenameModalOpen}
            onClose={modals.closeModals}
            chatId={modals.selectedChat.id}
            currentTitle={modals.selectedChat.title}
            onRenameConfirm={modals.handleRenameConfirm}
          />

          <DeleteChatModal
            isOpen={modals.isDeleteModalOpen}
            onClose={modals.closeModals}
            chatId={modals.selectedChat.id}
            chatTitle={modals.selectedChat.title}
            onDeleteConfirm={() => modals.handleDeleteConfirm(false)}
          />
        </>
      )}
    </>
  );
};

export default BurgerMenu;
