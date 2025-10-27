import React from "react";
import { Message } from "../../../shared/entities/ChatTypes";
import ChatFixedHeader from "./generics/ChatFixedHeader";
import ChatInput from "./generics/ChatInput";
import MessageList from "./generics/MessageList";
import QuickActions from "./generics/QuickActions";
import PostViewPanel from "./PostViewPanel/PostViewPanel";

interface ChatProps {
  sessionIdParam: string;
  chatTitle: string;
  associatedPostId?: string;
  messages: Message[];
  messageInput: string;
  isLoading: boolean;
  showQuickActions: boolean;
  isFirstMessage: boolean;
  jobs: any[];
  onMessageInputChange: (value: string) => void;
  onSendMessage: (message: string, images?: any[]) => Promise<void>;
  onSuggestionClick: (job: any, answer: string) => Promise<void>;
  onQuickAction: (text: string) => Promise<void>;
  onRenameChat: () => void;
  onDeleteChat: () => void;
  onToggleSidebar: () => void;
}

const Chat: React.FC<ChatProps> = ({
  sessionIdParam,
  chatTitle,
  associatedPostId,
  messages,
  messageInput,
  isLoading,
  showQuickActions,
  isFirstMessage,
  jobs,
  onMessageInputChange,
  onSendMessage,
  onSuggestionClick,
  onQuickAction,
  onRenameChat,
  onDeleteChat,
  onToggleSidebar,
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="chat-wrapper flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-out">
        <ChatFixedHeader
          chatId={sessionIdParam}
          chatTitle={chatTitle}
          associatedPostId={associatedPostId}
          onRenameChat={onRenameChat}
          onDeleteChat={onDeleteChat}
          onToggleSidebar={onToggleSidebar}
        />

        <div className="flex-wrapper flex-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 pb-6">
              <div
                className={`transition-opacity duration-500 ${
                  messages.length === 0 ? "opacity-0" : "opacity-100"
                }`}
              >
                <MessageList key={sessionIdParam} messages={messages} />
              </div>
            </div>
          </div>

          <ChatInput
            value={messageInput}
            onChange={onMessageInputChange}
            onSend={onSendMessage}
            isLoading={isLoading}
            jobs={jobs}
            handleSuggestionClick={onSuggestionClick}
            sessionId={sessionIdParam}
          >
            {/* TODO: Provoque un re-rendu et un rapide resize au chargement du chat */}
            {/* {isFirstMessage && showQuickActions && (
              <QuickActions onSelect={onQuickAction} />
            )} */}
          </ChatInput>
        </div>
      </div>

      {/* Post View Panel - spécifique au chat */}
      <PostViewPanel />
    </div>
  );
};

export default Chat;
