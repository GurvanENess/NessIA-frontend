import { useApp } from "../../../shared/contexts/AppContext";
import { useChatModals } from "../../../shared/hooks/useChatModals";
import { useChatMessages } from "./useChatMessages";
import { useChatSession } from "./useChatSession";

/**
 * Hook principal du chat qui combine toute la logique
 * Utilise des hooks spécialisés pour une meilleure organisation
 */
export const useChatLogic = (sessionIdParam?: string) => {
  const { state } = useApp();
  const { messageInput, isLoading, showQuickActions } = state.chat;

  // 1. Session management (messages, polling, conversations)
  const session = useChatSession(sessionIdParam);

  // 2. Message processing (send, suggestions, quick actions)
  const messages = useChatMessages(
    sessionIdParam,
    session.refreshConversations,
    session.fetchMessages,
    session.startPolling
  );

  // 3. Modal management (rename, delete) - hook global
  const modals = useChatModals();

  // Handlers spécifiques au chat pour les modales
  const handleRenameChat = () => {
    if (sessionIdParam && session.chatTitle) {
      modals.openRenameModal(sessionIdParam, session.chatTitle);
    }
  };

  const handleDeleteChat = () => {
    if (sessionIdParam && session.chatTitle) {
      modals.openDeleteModal(sessionIdParam, session.chatTitle);
    }
  };

  // Wrapper pour la suppression avec redirection vers l'accueil
  const handleDeleteConfirm = () => {
    modals.handleDeleteConfirm(true); // true = redirect to home
  };

  // Computed values
  const isFirstMessage = session.messages.length === 0;

  return {
    // Session data
    sessionId: session.sessionId,
    messages: session.messages,
    messageInput,
    isLoading,
    showQuickActions,
    jobs: session.jobs,
    isFirstMessage,
    chatTitle: session.chatTitle,
    associatedPostId: session.associatedPostId,
    hasAccess: session.hasAccess,
    isCheckingAccess: session.isCheckingAccess,

    // Message handlers
    handleSendMessage: messages.handleSendMessage,
    handleSuggestionClick: messages.handleSuggestionClick,
    handleQuickAction: messages.handleQuickAction,
    onMessageInputChange: messages.onMessageInputChange,

    // Modal handlers spécifiques au chat
    handleRenameChat,
    handleDeleteChat,
    handleDeleteConfirm,

    // Modal states depuis le hook global
    isRenameModalOpen: modals.isRenameModalOpen,
    isDeleteModalOpen: modals.isDeleteModalOpen,
    selectedChat: modals.selectedChat,
    handleRenameConfirm: modals.handleRenameConfirm,
    closeModals: modals.closeModals,
    setIsRenameModalOpen: modals.setIsRenameModalOpen,
    setIsDeleteModalOpen: modals.setIsDeleteModalOpen,
    setSelectedChat: modals.setSelectedChat,
  };
};
