import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../shared/contexts/AppContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { Message } from "../../../shared/entities/ChatTypes";
import { logger } from "../../../shared/utils/logger";
import { MediaWithUploadState } from "../entities/media";
import { AiClient } from "../services/AIClient";
import { isMessageEmpty } from "../utils/utils";

/**
 * Hook responsable du traitement des messages
 * - Envoi de messages utilisateur
 * - Communication avec l'IA
 * - Gestion des suggestions et actions rapides
 */
export const useChatMessages = (
  sessionIdParam?: string,
  refreshConversations?: () => Promise<void>,
  fetchMessages?: (sessionId: string) => Promise<void>,
  startPolling?: (sessionId: string) => Promise<any>
) => {
  const { user } = useAuth();
  const { dispatch, state } = useApp();
  const { sessionId, isLoading } = state.chat;
  const navigate = useNavigate();

  const processUserMessage = async (
    message: string,
    images?: MediaWithUploadState[]
  ) => {
    try {
      const messageId = crypto.randomUUID();
      const userMessage: Message = {
        id: messageId,
        isAi: false,
        content: message,
        timestamp: new Date(),
        isLoading: true, // Message en loading
        media:
          images && images.length > 0
            ? images.map((img) => ({
                id: img.id,
                url: img.url,
              }))
            : undefined,
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      dispatch({ type: "SET_MESSAGE_INPUT", payload: "" });
      return userMessage;
    } catch (err) {
      logger.error("Error processing user message", err);
      throw err;
    }
  };

  const processAiResponse = async (
    message: string,
    images?: MediaWithUploadState[]
  ) => {
    try {
      const response = await AiClient.getResponse({
        message: message,
        sessionId: sessionId,
        userToken: user?.token,
        companyId: state.currentCompany?.id || "1",
        medias: images && images.length > 0 ? images : undefined,
      });

      if (startPolling) await startPolling(response.sessionId);
      if (fetchMessages) await fetchMessages(response.sessionId);
      if (refreshConversations) await refreshConversations();
      
      // Attendre un peu pour laisser le temps à la BD de se synchroniser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Déclencher le refresh du PostViewPanel après avoir récupéré les messages
      dispatch({ type: "REFRESH_POST_PANEL" });

      if (!sessionId) {
        dispatch({ type: "SET_CHAT_SESSION_ID", payload: response.sessionId });
        navigate(`/chats/${response.sessionId}`);
      }
    } catch (err) {
      logger.error("Error processing AI response", err);
      throw err;
    }
  };

  const handleSendMessage = async (
    message: string,
    images?: MediaWithUploadState[]
  ) => {
    if (isLoading || isMessageEmpty(message)) return;

    // Vérifier que toutes les images sont en état local (prêtes à être uploadées)
    if (images && images.some((img) => img.uploadState !== "local")) {
      toast.error("Toutes les images doivent être en état local", {
        duration: 3000,
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    let userMessage: Message | null = null;

    try {
      userMessage = await processUserMessage(message, images);
      await processAiResponse(message, images);

      // Marquer le message comme terminé
      if (userMessage.id) {
        dispatch({
          type: "SET_MESSAGE_LOADING",
          payload: { messageId: userMessage.id, isLoading: false },
        });
      }
    } catch (err) {
      // Marquer le message comme terminé même en cas d'erreur
      if (userMessage?.id) {
        dispatch({
          type: "SET_MESSAGE_LOADING",
          payload: { messageId: userMessage.id, isLoading: false },
        });
      }

      logger.error("Error processing message", err);
      dispatch({
        type: "SET_ERROR",
        payload: "Une erreur est survenue lors de l'envoie du message.",
      });
      toast.error("Une erreur est survenue lors de l'envoi du message", {
        duration: 3000,
        style: { background: "#f44336", color: "#fff" },
        iconTheme: { primary: "#fff", secondary: "#f44336" },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSuggestionClick = async (job: any, answer: string) => {
    try {
      if (!sessionIdParam || !user?.token || !job) return;

      await AiClient.sendAnswerToSuggestion({
        sessionId: sessionIdParam,
        userToken: user?.token,
        userInput: answer,
        jobId: job.id,
        agentIndex: job.need_user_input?.agent_index,
        companyId: state.currentCompany?.id || "1",
      });

      if (startPolling) await startPolling(sessionIdParam);
      if (fetchMessages) await fetchMessages(sessionIdParam);
      
      // Attendre un peu pour laisser le temps à la BD de se synchroniser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Déclencher le refresh du PostViewPanel après avoir récupéré les messages
      dispatch({ type: "REFRESH_POST_PANEL" });
    } catch (err) {
      logger.error("Error sending suggestion response", err);
      toast.error("Une erreur est survenue lors de l'envoi de la réponse", {
        duration: 3000,
      });
    }
  };

  const handleQuickAction = async (text: string) => {
    dispatch({ type: "HIDE_QUICK_ACTIONS" });
    await handleSendMessage(text, []);
  };

  return {
    handleSendMessage,
    handleSuggestionClick,
    handleQuickAction,
    onMessageInputChange: (value: string) =>
      dispatch({ type: "SET_MESSAGE_INPUT", payload: value }),
  };
};
