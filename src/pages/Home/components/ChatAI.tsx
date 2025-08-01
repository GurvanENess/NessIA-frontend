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
import { p } from "framer-motion/client";

const Chat: React.FC = () => {
  const { chatId: sessionIdParam } = useParams();
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const {
    fetchJobs,
    jobs,
    isPolling,
    startPolling,
    stopPolling,
    hasRunningJobs,
  } = useJobPolling();
  const { sessionId } = useApp().state.chat;
  const { messages, messageInput, isLoading, error, showQuickActions } =
    state.chat;

  // Déplacer la logique conditionnelle dans un useEffect
  useEffect(() => {
    if (sessionIdParam && sessionId !== sessionIdParam) {
      dispatch({ type: "SET_CHAT_SESSION_ID", payload: sessionIdParam });
    }
  }, [sessionIdParam, sessionId, dispatch]);

  // Nettoyer le polling quand le composant se démonte
  useEffect(() => {
    return () => {
      if (isPolling) {
        stopPolling();
      }
    };
  }, [isPolling, stopPolling]);

  const fetchMessages = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
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
      fetchJobs(sessionIdParam);
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
        // Ne se mets pas à jour automatiquement pour la suite
        dispatch({ type: "SET_CHAT_SESSION_ID", payload: response.sessionId });
      }

      // Lancer le polling pour surveiller les jobs en cours
      await startPolling(response.sessionId);
      console.log("Polling started for session:", response.sessionId);

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

  // Fonction pour gérer les interactions utilisateur avec les jobs en attente
  const handleJobInteraction = async (jobId: string, userInput: any) => {
    try {
      // Ici vous pouvez appeler une API pour envoyer l'interaction utilisateur
      console.log("Sending user interaction for job:", jobId, userInput);

      // Relancer le polling pour voir les mises à jour
      if (sessionId) {
        await startPolling(sessionId);
      }
    } catch (err) {
      console.error("Error handling job interaction:", err);
      toast.error("Erreur lors de l'interaction avec le job", {
        duration: 3000,
      });
    }
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

      {/* Affichage des jobs en cours avec interactions */}
      {jobs.length > 0 && (
        <div className="fixed bottom-32 left-0 right-0 md:pb-8 z-10">
          <div className="sm:max-w-full md:max-w-2xl mx-auto px-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-300 rounded-lg p-4 mb-2 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {job.status === "running"
                      ? "Traitement en cours..."
                      : "En attente d'interaction"}
                  </span>
                </div>

                {job.current_msg && (
                  <p className="text-sm text-gray-600 mb-2 animate-pulse">
                    {job.current_msg}
                  </p>
                )}

                {job.status === "waiting_user" && job.need_user_input && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Interaction requise :
                    </p>
                    <div className="flex gap-2">
                      {Array.isArray(job.need_user_input) ? (
                        job.need_user_input.map(
                          (option: string, index: number) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleJobInteraction(job.id, option)
                              }
                              className="px-3 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200 transition-colors"
                            >
                              {option}
                            </button>
                          )
                        )
                      ) : (
                        <button
                          onClick={() =>
                            handleJobInteraction(job.id, job.need_user_input)
                          }
                          className="px-3 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200 transition-colors"
                        >
                          Continuer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
