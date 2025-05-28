import { useState } from "react";
import { Message as MessageType } from "../types/ChatTypes";
import { Action } from "../types/mockAITypes";
import { mockAiClient } from "../api/mockAi";
import { FormEvent, KeyboardEvent } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hideAllActions = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, showActions: false })));
  };

  const sendMessage = async (text: string, addUserMessage = true) => {
    if (isLoading) return;
    hideAllActions();
    setIsLoading(true);
    setError(null);

    if (addUserMessage) {
      const userMessage: MessageType = {
        id: crypto.randomUUID(),
        isAi: false,
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    try {
      const response = await mockAiClient.getResponse({ message: text });
      const aiResponse: MessageType = {
        id: crypto.randomUUID(),
        isAi: true,
        content: response.message,
        timestamp: new Date(),
        showActions: false,
        actions: response.availableActions,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiResponse.id ? { ...msg, showActions: true } : msg
          )
        );
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (
    e: FormEvent | KeyboardEvent
  ) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const text = messageInput;
    setMessageInput("");
    await sendMessage(text, true);
  };

  const handleAction = async (action: Action) => {
    await sendMessage(action.label, false);
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    isLoading,
    error,
    handleSendMessage,
    handleAction,
  };
};

export default useChat;
