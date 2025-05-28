import React, { useState, useRef, useEffect } from "react";
import { Send, Image, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Message as MessageType } from "../../../types/ChatTypes";
import { Action } from "../../../types/mockAITypes";
import { mockAiClient } from "../../../api/mockAi";
import Message from "./ChatMessage";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [messageInput]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        // Ctrl+Enter: insert new line
        setMessageInput((prev) => prev + "\n");
      } else {
        // Enter: send message
        e.preventDefault();
        handleSendMessage(e);
      }
    }
  };

  const hideAllActions = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, showActions: false })));
  };

  const sendMessage = async (text: string, addUserMessage = true) => {
    if (isLoading) return;
    hideAllActions();
    setShowWelcome(false);
    setIsLoading(true);
    setError(null);

    let userMessage: MessageType | null = null;
    if (addUserMessage) {
      userMessage = {
        id: crypto.randomUUID(),
        isAi: false,
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage!]);
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
      textareaRef.current?.focus();
    }
  };

  const handleSendMessage = async (
    e: React.FormEvent | React.KeyboardEvent
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

  return (
    <>
      {/* Messages */}
      <div className="flex-1 pt-16 md:pb-32 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4">
          {showWelcome && messages.length === 0 && (
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
            className={`flex flex-col space-y-6 py-6 transition-opacity duration-500 ${
              showWelcome ? "opacity-0" : "opacity-100"
            }`}
            ref={messagesContainerRef}
          >
            {messages.map((message) => (
              <Message
                key={message.id}
                handleAction={handleAction}
                {...message}
              />
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 md:pb-8">
        <form
          onSubmit={handleSendMessage}
          className="sm:max-w-full md:max-w-2xl mx-auto"
        >
          {/* Quick Actions Carousel */}
          {showWelcome && (
            <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 w-max">
                <button
                  type="button"
                  onClick={() => {
                    setMessageInput("Créer un post Instagram");
                    textareaRef.current?.focus();
                  }}
                  className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Instagram className="w-5 h-5 text-[#1A201B]" />
                  <span className="text-sm text-[#1A201B]">
                    Créer un post Instagram
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessageInput("Créer un post Facebook");
                    textareaRef.current?.focus();
                  }}
                  className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Facebook className="w-5 h-5 text-[#1A201B]" />
                  <span className="text-sm text-[#1A201B]">
                    Créer un post Facebook
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessageInput("Créer un post TikTok");
                    textareaRef.current?.focus();
                  }}
                  className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5 text-[#1A201B]" />
                  <span className="text-sm text-[#1A201B]">
                    Créer un post TikTok
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Error and Loading States */}

          {error && <p className="text-sm text-red-600 px-4 mb-2">{error}</p>}
          {isLoading && (
            <p className="text-sm text-gray-500 px-4 mb-2">NessIA rédige...</p>
          )}

          <div className="relative w-full md:mx-auto bg-white md:rounded-2xl border border-gray-300 transition-colors shadow-sm">
            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Discuter avec NessIA"
              rows={1}
              disabled={isLoading}
              className="resize-none w-full px-4 pt-4 pb-2 rounded-2xl bg-transparent focus:outline-none max-h-[200px] overflow-y-auto whitespace-pre-wrap"
              style={{ minHeight: "56px" }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button
                type="button"
                className="hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <Image className="w-7 h-7 text-[#1A201B]" />
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#7C3AED] text-white p-[5px] rounded-md hover:bg-[#6D28D9] transition-colors shadow-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
