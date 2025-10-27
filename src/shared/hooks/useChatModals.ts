import React from "react";
import { useNavigate } from "react-router-dom";
import { formatChatsforUi } from "../../pages/Chats/utils/utils";
import { useApp } from "../contexts/AppContext";
import { db } from "../services/db";
import { logger } from "../utils/logger";
import { useChats } from "./useChats";

/**
 * Hook global pour la gestion des modales de chat
 * Utilisé partout où on a besoin de renommer/supprimer un chat
 * (BurgerMenu, ChatPage, etc.)
 */
export const useChatModals = () => {
  const { dispatch, state } = useApp();
  const { renameChat, deleteChat, fetchChats } = useChats();
  const navigate = useNavigate();

  // Modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedChat, setSelectedChat] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  const openRenameModal = (chatId: string, chatTitle: string) => {
    setSelectedChat({ id: chatId, title: chatTitle });
    setIsRenameModalOpen(true);
  };

  const openDeleteModal = (chatId: string, chatTitle: string) => {
    setSelectedChat({ id: chatId, title: chatTitle });
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsRenameModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedChat(null);
  };

  const handleRenameConfirm = async (newTitle: string) => {
    if (selectedChat) {
      // Mettre à jour le store local immédiatement pour l'affichage
      renameChat(selectedChat.id, newTitle);

      // Recharger les chats depuis la base pour maintenir la synchronisation
      if (state.currentCompany?.id) {
        try {
          const userChats = await db.getAllChats(state.currentCompany.id);
          const userChatsFormated = formatChatsforUi(userChats);
          fetchChats(userChatsFormated);
        } catch (err) {
          logger.error("Failed to reload chats after rename", err);
        }
      }
    }
  };

  const handleDeleteConfirm = (redirectToHome = false) => {
    if (selectedChat) {
      deleteChat(selectedChat.id);

      // Optionnel: rediriger vers l'accueil après suppression
      if (redirectToHome) {
        dispatch({ type: "RESET_CHAT" });
        navigate("/");
      }
    }
  };

  return {
    // Modal states
    isRenameModalOpen,
    isDeleteModalOpen,
    selectedChat,

    // Modal actions
    openRenameModal,
    openDeleteModal,
    closeModals,

    // Modal handlers
    handleRenameConfirm,
    handleDeleteConfirm,

    // Direct setters (pour compatibilité avec le code existant)
    setIsRenameModalOpen,
    setIsDeleteModalOpen,
    setSelectedChat,
  };
};
