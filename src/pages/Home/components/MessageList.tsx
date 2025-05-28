import React, { useRef, useEffect } from "react";
import Message from "./ChatMessage";
import { Message as MessageType } from "../../../types/ChatTypes";
import { Action } from "../../../types/mockAITypes";

// TODO : Mettre les types des messages dans le fichier src/types/ChatTypes.ts

interface MessageListProps {
  messages: MessageType[];
  handleAction: (action: Action) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  handleAction,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      {messages.map((message) => (
        <Message key={message.id} handleAction={handleAction} {...message} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
