import React from "react";
import { useParams } from "react-router-dom";
import DeleteChatModal from "../../../shared/components/DeleteChatModal";
import RenameChatModal from "../../../shared/components/RenameChatModal";
import { useChatLogic } from "../hooks/useChatLogic";
import { useCommonLogic } from "../hooks/useCommonLogic";
import Chat from "./Chat";
import Landing from "./Landing";

const ChatPage: React.FC = () => {
  const { chatId: sessionIdParam } = useParams();
  const isHomePage = !sessionIdParam;

  // Logique commune (Landing + Chat)
  const commonLogic = useCommonLogic();

  // Logique spécifique chat (uniquement si pas homePage)
  const chatLogic = useChatLogic(sessionIdParam);

  // Si on vérifie l'accès à un chat spécifique, afficher un indicateur
  if (sessionIdParam && chatLogic.isCheckingAccess) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'accès au chat...</p>
        </div>
      </div>
    );
  }

  // Si on a un chatId mais pas d'accès, le hook redirigera automatiquement vers 404
  if (sessionIdParam && !chatLogic.hasAccess) {
    return null;
  }

  return (
    <>
      {isHomePage ? (
        <Landing
          {...commonLogic}
          onMessageInputChange={chatLogic.onMessageInputChange}
          onSendMessage={chatLogic.handleSendMessage}
          onSuggestionClick={chatLogic.handleSuggestionClick}
          onQuickAction={chatLogic.handleQuickAction}
        />
      ) : (
        <Chat
          {...commonLogic}
          sessionIdParam={sessionIdParam!}
          chatTitle={chatLogic.chatTitle}
          associatedPostId={chatLogic.associatedPostId}
          messages={chatLogic.messages}
          jobs={chatLogic.jobs}
          isFirstMessage={chatLogic.isFirstMessage}
          onMessageInputChange={chatLogic.onMessageInputChange}
          onSendMessage={chatLogic.handleSendMessage}
          onSuggestionClick={chatLogic.handleSuggestionClick}
          onQuickAction={chatLogic.handleQuickAction}
          onRenameChat={chatLogic.handleRenameChat}
          onDeleteChat={chatLogic.handleDeleteChat}
        />
      )}

      {/* Modals - uniquement pour le chat */}
      {!isHomePage && chatLogic.selectedChat && (
        <>
          <RenameChatModal
            isOpen={chatLogic.isRenameModalOpen}
            onClose={() => {
              chatLogic.setIsRenameModalOpen(false);
              chatLogic.setSelectedChat(null);
            }}
            chatId={chatLogic.selectedChat.id}
            currentTitle={chatLogic.selectedChat.title}
            onRenameConfirm={chatLogic.handleRenameConfirm}
          />

          <DeleteChatModal
            isOpen={chatLogic.isDeleteModalOpen}
            onClose={() => {
              chatLogic.setIsDeleteModalOpen(false);
              chatLogic.setSelectedChat(null);
            }}
            chatId={chatLogic.selectedChat.id}
            chatTitle={chatLogic.selectedChat.title}
            onDeleteConfirm={chatLogic.handleDeleteConfirm}
          />
        </>
      )}
    </>
  );
};

export default ChatPage;
