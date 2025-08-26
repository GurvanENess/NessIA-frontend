import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useChatsStore } from "../../../pages/Chats/store/chatsStore";
import { formatChatsforUi } from "../../../pages/Chats/utils/utils";
import DeleteChatModal from "../../../shared/components/DeleteChatModal";
import RenameChatModal from "../../../shared/components/RenameChatModal";
import { useApp } from "../../../shared/contexts/AppContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { Message } from "../../../shared/entities/ChatTypes";
import { useCompanyResourceAccess } from "../../../shared/hooks/useCompanyResourceAccess";
import useJobPolling from "../../../shared/hooks/useJobPolling";
import { db } from "../../../shared/services/db";
import { AiClient } from "../services/AIClient";
import { formatMessagesFromDb, isMessageEmpty } from "../utils/utils";
import ChatFixedHeader from "./ChatFixedHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import QuickActions from "./QuickActions";

const Chat: React.FC = () => {
  // ===== HOOKS & VARIABLES INITIALES =====

  const { user } = useAuth();
  const { chatId: sessionIdParam } = useParams();
  const appContext = useApp();
  const { dispatch, state } = appContext;
  const {
    chat: {
      sessionId,
      messages,
      messageInput,
      isLoading,
      error,
      showQuickActions,
    },
  } = state;
  const { jobs, startPolling, stopPolling } = useJobPolling();
  const navigate = useNavigate();
  const { conversations, fetchChats, renameChat, deleteChat } = useChatsStore();

  // Modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedChat, setSelectedChat] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  // Sur la page d'accueil, on n'a pas besoin de vérifier l'accès
  const isHomePage = !sessionIdParam;

  // Vérifier l'accès au chat par compagnie (seulement si on a un chatId)
  const {
    hasAccess,
    isLoading: isCheckingAccess,
    resourceData: chatData,
  } = useCompanyResourceAccess("chat");

  const isFirstMessage = messages.length === 0;

  // Get current chat data
  const currentChat = conversations.find((chat) => chat.id === sessionIdParam);
  const chatTitle = chatData?.title || currentChat?.title || "Conversation";
  const associatedPostId = currentChat?.associatedPostId;

  // Load chats when component mounts (for header functionality)
  useEffect(() => {
    const loadChats = async () => {
      if (sessionIdParam && state.currentCompany?.id) {
        try {
          const userChats = await db.getAllChats(state.currentCompany.id);
          const userChatsFormated = formatChatsforUi(userChats);
          fetchChats(userChatsFormated);
        } catch (err) {
          console.error("Failed to load chats for header:", err);
        }
      }
    };

    loadChats();
  }, [sessionIdParam, state.currentCompany?.id]);

  // ===== LOGIQUE DE GESTION DES SESSIONS =====

  useEffect(() => {
    if (sessionIdParam && sessionId !== sessionIdParam) {
      dispatch({ type: "SET_CHAT_SESSION_ID", payload: sessionIdParam });
    }
  }, [sessionIdParam, sessionId, dispatch]);

  useEffect(() => {
    if (sessionIdParam) {
      fetchMessages(sessionIdParam);
      startPolling(sessionIdParam);
    }

    return () => {
      console.log("UNMOUNTED");
      stopPolling();
    };
  }, [sessionIdParam]);

  // ===== LOGIQUE DE TRAITEMENT DES MESSAGES =====

  const fetchMessages = async (sessionId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await db.getChatSessionMessages(sessionId, user!.id);
      dispatch({
        type: "SET_MESSAGES",
        payload: formatMessagesFromDb(data),
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const processUserMessage = async (message: string) => {
    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        isAi: false,
        content: message,
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      dispatch({ type: "SET_MESSAGE_INPUT", payload: "" });

      return userMessage;
    } catch (err) {
      console.error("Error processing user message:", err);
      throw err;
    }
  };

  const processAiResponse = async (message: string) => {
    try {
      const response = await AiClient.getResponse({
        message: message,
        sessionId: sessionId,
        userToken: user?.token,
        companyId: state.currentCompany?.id || "1",
      });

      console.log(response);

      await startPolling(response.sessionId);
      await fetchMessages(response.sessionId);

      if (!sessionId) {
        dispatch({ type: "SET_CHAT_SESSION_ID", payload: response.sessionId });
        navigate(`/chats/${response.sessionId}`);
      }
    } catch (err) {
      console.error("Error processing AI response:", err);
      throw err;
    }
  };

  // ===== HANDLERS =====

  const handleSendMessage = async (
    message: string,
    hideUserMessage?: boolean
  ) => {
    if (isLoading) return;
    if (isMessageEmpty(message)) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await processUserMessage(message);
      await processAiResponse(message);
    } catch (err) {
      console.error("Error processing message:", err);
      dispatch({
        type: "SET_ERROR",
        payload: "Une erreur est survenue lors de l'envoie du message.",
      });
      toast.error("Une erreur est survenue lors de l'envoi du message", {
        duration: 3000,
        style: {
          background: "#f44336",
          color: "#fff",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#f44336",
        },
      });
      return;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSuggestionClick = async (job: any, answer: string) => {
    try {
      if (!sessionIdParam || !user?.token || !job) return;

      const response = await AiClient.sendAnswerToSuggestion({
        sessionId: sessionIdParam,
        userToken: user?.token,
        userInput: answer,
        jobId: job.id,
        agentIndex: job.need_user_input?.agent_index,
        companyId: state.currentCompany?.id || "1",
      });

      console.log(response);

      await startPolling(sessionIdParam);
      await fetchMessages(sessionIdParam);
    } catch (err) {
      console.error("Error sending suggestion response:", err);
      toast.error("Une erreur est survenue lors de l'envoi de la réponse", {
        duration: 3000,
      });
    }
  };

  const handleQuickAction = async (text: string) => {
    dispatch({ type: "HIDE_QUICK_ACTIONS" });
    await handleSendMessage(text, true);
  };

  // ===== CHAT MANAGEMENT HANDLERS =====

  const handleRenameChat = () => {
    if (sessionIdParam) {
      setSelectedChat({ id: sessionIdParam, title: chatTitle });
      setIsRenameModalOpen(true);
    }
  };

  const handleDeleteChat = () => {
    if (sessionIdParam) {
      setSelectedChat({ id: sessionIdParam, title: chatTitle });
      setIsDeleteModalOpen(true);
    }
  };

  const handleRenameConfirm = (newTitle: string) => {
    if (selectedChat) {
      renameChat(selectedChat.id, newTitle);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedChat) {
      deleteChat(selectedChat.id);
      // Navigate to home after deletion
      dispatch({ type: "RESET_CHAT" });
      navigate("/");
    }
  };

  // ===== RENDERING =====

  // Si on vérifie l'accès à un chat spécifique, afficher un indicateur
  if (sessionIdParam && isCheckingAccess) {
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
  if (sessionIdParam && !hasAccess) {
    return null;
  }

  // Sur la page d'accueil, on affiche toujours le contenu
  if (isHomePage) {
    return (
      <>
        <div className="flex-1 pt-20 md:pb-36 pb-28 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4">
            {messages.length === 0 && (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-full">
                  <img
                    src="/assets/green_star.svg"
                    alt="Star Background"
                    className="max-w-[150%] w-[150%] top-1/2 left-1/2 overflow-hidden absolute translate-x-[-50%] translate-y-[-50%] opacity-70 transform transition-opacity duration-1000 [filter:hue-rotate(235deg)_saturate(150%)]"
                  />
                  <div className="absolute inset-0 flex flex-col w-full items-center justify-center text-center p-4 sm:p-6 md:p-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-coolvetica text-black mb-2">
                      Prêt à créer des posts qui captivent ?
                    </h2>
                    <p className="font-coolvetica w-[60%] text-centerleading-5 text-md sm:text-base md:text-lg text-black">
                      Dites-nous ce que vous voulez partager !
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`transition-opacity duration-500 ${
                messages.length === 0 ? "opacity-0" : "opacity-100"
              }`}
            >
              <MessageList messages={messages} />
            </div>
          </div>
        </div>

        <ChatInput
          value={messageInput}
          onChange={(value) =>
            dispatch({ type: "SET_MESSAGE_INPUT", payload: value })
          }
          onSend={handleSendMessage}
          isLoading={isLoading}
          jobs={jobs}
          handleSuggestionClick={handleSuggestionClick}
        >
          {isFirstMessage && showQuickActions && (
            <QuickActions onSelect={handleQuickAction} />
          )}
        </ChatInput>
      </>
    );
  }

  return (
    <div className="chat-wrapper flex flex-col h-screen overflow-y-auto">
      {/* Fixed Header for Chat */}
      {sessionIdParam && (
        <ChatFixedHeader
          chatId={sessionIdParam}
          chatTitle={chatTitle}
          associatedPostId={associatedPostId}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />
      )}

      <div className="flex-wrapper flex-1 flex flex-col h-full">
        <div className="flex-1">
          <div className="max-w-3xl mx-auto px-4">
            {messages.length === 0 && (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-full">
                  <img
                    src="/assets/green_star.svg"
                    alt="Star Background"
                    className="max-w-[150%] w-[150%] top-1/2 left-1/2 overflow-hidden absolute translate-x-[-50%] translate-y-[-50%] opacity-70 transform transition-opacity duration-1000 [filter:hue-rotate(235deg)_saturate(150%)]"
                  />
                  <div className="absolute inset-0 flex flex-col w-full items-center justify-center text-center p-4 sm:p-6 md:p-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-coolvetica text-black mb-2">
                      Prêt à créer des posts qui captivent ?
                    </h2>
                    <p className="font-coolvetica w-[60%] text-centerleading-5 text-md sm:text-base md:text-lg text-black">
                      Dites-nous ce que vous voulez partager !
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`transition-opacity duration-500 ${
                messages.length === 0 ? "opacity-0" : "opacity-100"
              }`}
            >
              <MessageList messages={messages} />
            </div>
          </div>
        </div>

        <ChatInput
          value={messageInput}
          onChange={(value) =>
            dispatch({ type: "SET_MESSAGE_INPUT", payload: value })
          }
          onSend={handleSendMessage}
          isLoading={isLoading}
          jobs={jobs}
          handleSuggestionClick={handleSuggestionClick}
        >
          {isFirstMessage && showQuickActions && (
            <QuickActions onSelect={handleQuickAction} />
          )}
        </ChatInput>
      </div>

      {/* Modals */}
      {selectedChat && (
        <>
          <RenameChatModal
            isOpen={isRenameModalOpen}
            onClose={() => {
              setIsRenameModalOpen(false);
              setSelectedChat(null);
            }}
            chatId={selectedChat.id}
            currentTitle={selectedChat.title}
            onRenameConfirm={handleRenameConfirm}
          />

          <DeleteChatModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedChat(null);
            }}
            chatId={selectedChat.id}
            chatTitle={selectedChat.title}
            onDeleteConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </div>
  );
};

export default Chat;
