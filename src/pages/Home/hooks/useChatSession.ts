import { useEffect } from "react";
import { formatChatsforUi } from "../../../pages/Chats/utils/utils";
import { useApp } from "../../../shared/contexts/AppContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useChats } from "../../../shared/hooks/useChats";
import { useCompanyResourceAccess } from "../../../shared/hooks/useCompanyResourceAccess";
import useJobPolling from "../../../shared/hooks/useJobPolling";
import { db } from "../../../shared/services/db";
import { logger } from "../../../shared/utils/logger";
import { formatMessagesFromDb } from "../utils/utils";

/**
 * Hook responsable de la gestion de la session chat
 * - Initialisation de la session
 * - Récupération des messages
 * - Polling des jobs
 * - Gestion des conversations
 */
export const useChatSession = (sessionIdParam?: string) => {
  const { user } = useAuth();
  const { dispatch, state } = useApp();
  const { sessionId, messages } = state.chat;
  const { jobs, startPolling, stopPolling } = useJobPolling();
  const { conversations, fetchChats } = useChats();
  const {
    hasAccess,
    isLoading: isCheckingAccess,
    resourceData: chatData,
  } = useCompanyResourceAccess("chat");

  // Get current chat data
  const currentChat = conversations.find((chat) => chat.id === sessionIdParam);
  const chatTitle = currentChat?.title || chatData?.title || "Conversation";
  const associatedPostId = currentChat?.associatedPostId;

  // Load chats when component mounts
  useEffect(() => {
    const loadChats = async () => {
      if (sessionIdParam && state.currentCompany?.id) {
        try {
          const userChats = await db.getAllChats(state.currentCompany.id);
          const userChatsFormated = formatChatsforUi(userChats);
          fetchChats(userChatsFormated);
        } catch (err) {
          logger.error("Failed to load chats for header", err);
        }
      }
    };
    loadChats();
  }, [sessionIdParam, state.currentCompany?.id]);

  // Set session ID and clear messages when changing sessions
  useEffect(() => {
    if (sessionIdParam && sessionId !== sessionIdParam) {
      // Réinitialiser immédiatement les messages pour éviter l'affichage des anciens
      dispatch({ type: "SET_MESSAGES", payload: [] });
      dispatch({ type: "SET_CHAT_SESSION_ID", payload: sessionIdParam });
    }
  }, [sessionIdParam, sessionId, dispatch]);

  // Open post panel if a post is created
  // Optimisation : ouvrir immédiatement pour éviter le redimensionnement brutal
  useEffect(() => {
    if (associatedPostId) {
      // Ouvrir le panel immédiatement, avant même de charger le post
      // Cela permet au layout de se préparer et évite le "flash"
      dispatch({ type: "OPEN_POST_PANEL", payload: associatedPostId });
    }
    // Note: On ne force pas la fermeture ici pour permettre à l'utilisateur
    // de fermer manuellement le panel en mobile sans qu'il se rouvre
  }, [associatedPostId, dispatch]);

  // Fetch messages and start polling
  useEffect(() => {
    const fetchMessagesAndStartPolling = async () => {
      if (sessionIdParam) {
        await fetchMessages(sessionIdParam);
        await startPolling(sessionIdParam);
      }
    };
    fetchMessagesAndStartPolling();
    return () => {
      stopPolling();
    };
  }, [sessionIdParam]);

  const fetchMessages = async (sessionId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await db.getChatSessionMessages(sessionId, user!.id);
      dispatch({
        type: "SET_MESSAGES",
        payload: formatMessagesFromDb(data),
      });
    } catch (err) {
      logger.error("Error fetching messages", err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const refreshConversations = async () => {
    if (!state.currentCompany) return;
    try {
      const conversations = await db.getAllChats(state.currentCompany.id);
      const chatsFormated = formatChatsforUi(conversations);
      fetchChats(chatsFormated);
    } catch (err) {
      logger.error("Failed to refresh conversations", err);
    }
  };

  return {
    // Session data
    sessionId,
    messages,
    chatTitle,
    associatedPostId,
    hasAccess,
    isCheckingAccess,
    jobs,

    // Session methods
    fetchMessages,
    refreshConversations,
    startPolling,
    stopPolling,
  };
};
