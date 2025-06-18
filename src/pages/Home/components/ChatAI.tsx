import React from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import QuickActions from "./QuickActions";
import { useApp } from "../../../shared/contexts/AppContext";
import { AiClient } from "../services/AIClient";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { Action } from "../entities/AITypes";

const Chat: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();
  const { sessionId } = useApp().state.chat;
  const { messages, messageInput, isLoading, error } = state.chat;

  const handleSendMessage = async (
    e?: React.FormEvent | React.KeyboardEvent,
    messageToSend?: string,
    hideUserMessage?: boolean
  ) => {
    if (isLoading) return;

    e && e.preventDefault();

    const message = messageToSend || messageInput.trim();
    if (!message) return;

    dispatch({ type: "HIDE_ALL_ACTIONS" });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    // Only show user message if not hidden (for quick actions and response actions)
    if (!hideUserMessage) {
      const userMessage = {
        id: crypto.randomUUID(),
        isAi: false,
        content: message,
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    }
    
    messageToSend || dispatch({ type: "SET_MESSAGE_INPUT", payload: "" });

    try {
      const response = await AiClient.getResponse({
        message: message,
        sessionId: sessionId,
        userToken: user?.token,
        companyId: "1",
      });

      if (!sessionId) {
        dispatch({ type: "SET_CHAT_SESSION_ID", payload: response.sessionId });
      }

      const aiResponse = {
        id: crypto.randomUUID(),
        isAi: true,
        content: response.message,
        timestamp: new Date(),
        showActions: false,
        action: response.action,
        postData: response.post,
      };

      dispatch({ type: "ADD_MESSAGE", payload: aiResponse });

      // Show actions after a delay
      setTimeout(() => {
        dispatch({ type: "SHOW_ACTIONS", payload: aiResponse.id });
      }, 1000);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      dispatch({
        type: "SET_ERROR",
        payload: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleAction = async (label: string) => {
    await handleSendMessage(undefined, label, true);
  };

  const handleQuickAction = async (text: string) => {
    await handleSendMessage(undefined, text, true);
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
        error={error}
      >
        {isFirstMessage && (
          <QuickActions
            onSelect={handleQuickAction}
          />
        )}
      </ChatInput>
    </>
  );
};

export default Chat;