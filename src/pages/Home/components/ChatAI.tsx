import React, { useEffect } from "react";
import { Message } from "../../../shared/entities/ChatTypes";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import QuickActions from "./QuickActions";
import { useApp } from "../../../shared/contexts/AppContext";
import { AiClient } from "../services/AIClient";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useJobPolling } from "../../../shared/hooks/useJobPolling";
import { db } from "../../../shared/services/db";
import { useParams } from "react-router-dom";
import {
  formatMessagesFromDb,
  formatMessageToDb,
  isMessageEmpty,
} from "../utils/utils";
import toast from "react-hot-toast";

const Chat: React.FC = () => {
  const { chatId: sessionIdParam } = useParams();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { fetchJobs, jobs, isPolling } = useJobPolling();
  const { sessionId } = useApp().state.chat;
  const { messages, messageInput, isLoading, error, showQuickActions } =
    state.chat;

  const fetchMessages = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_CHAT_SESSION_ID", payload: sessionIdParam! });
    try {
      const data = await db.getChatSessionMessages(sessionIdParam!, user!.id);
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

  useEffect(() => {
    if (sessionIdParam) {
      fetchMessages();
      fetchJobs();
    }
  }, [sessionIdParam]);

  const processUserMessage = async (message: string) => {
    try {
      // On part du principe pour le moment que les messages ne seront jamais retrieved
      // autrement qu'avec leur session ; par conséquent on a pas besoin de synchroniser
      // l'identifiant en back du message avec celui en front. On peut le générer à part...

      const userMessage: Message = {
        id: crypto.randomUUID(), // ...comme je le fais ici
        isAi: false,
        content: message,
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      dispatch({ type: "SET_MESSAGE_INPUT", payload: "" });

      return userMessage;
    } catch (err) {
      toast.error(
        "Une erreur est survenue lors du traitement du message utilisateur",
        {
          duration: 3000,
        }
      );
      console.error("Error processing user message:", err);
      throw err; // Propagate error to be handled in handleSendMessage
    }

    // les erreurs seront traitées au dessus (ig)
  };

  const processAiResponse = async (message: string) => {
    try {
      const response = await AiClient.getResponse({
        message: message,
        sessionId: sessionId,
        userToken: user?.token,
        companyId: "1",
      });

      console.log(response);

      if (!sessionId) {
        dispatch({ type: "SET_CHAT_SESSION_ID", payload: response.sessionId });
      }

      fetchMessages();

      await fetchJobs(response.sessionId);
      console.log("ok");
      await fetchMessages();
    } catch (err) {
      toast.error(
        "Une erreur est survenue lors du traitement de la réponse de l'IA",
        {
          duration: 3000,
        }
      );
      console.error("Error processing AI response:", err);
      throw err; // Propagate error to be handled in handleSendMessage
    }
  };

  const handleSendMessage = async (
    message: string,
    hideUserMessage?: boolean
  ) => {
    // Empêche d'envoyer un message si le chat est en cours de chargement

    if (isLoading) return;
    if (isMessageEmpty(message)) return;

    // On cache les actions et on démarre le chargement en front du message
    dispatch({ type: "HIDE_ALL_ACTIONS" });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    // TODO N'ajoute pas le message de l'utilisateur à l'état si hideUserMessage est vrai
    try {
      await processUserMessage(message);
      await processAiResponse(message);
    } catch (err) {
      // A automatiser / Mieux gérer
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

  const handleAction = async (label: string) => {
    await handleSendMessage(label, true);
  };

  const handleQuickAction = async (text: string) => {
    dispatch({ type: "HIDE_QUICK_ACTIONS" });
    await handleSendMessage(text, true);
  };

  const isFirstMessage = messages.length === 0;

  return (
    <>
      <div className="flex-1 pt-16 md:pb-36 pb-28 overflow-hidden">
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
            <MessageList messages={messages} handleAction={handleAction} />
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
      >
        {isFirstMessage && showQuickActions && (
          <QuickActions onSelect={handleQuickAction} />
        )}
      </ChatInput>
    </>
  );
};

export default Chat;
