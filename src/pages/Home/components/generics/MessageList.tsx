import React, { useEffect, useRef } from "react";
import { Message as MessageType } from "../../../../shared/entities/ChatTypes";
import Message from "./ChatMessage";

// TODO : Mettre les types des messages dans le fichier src/types/ChatTypes.ts

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-6 py-6">
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
