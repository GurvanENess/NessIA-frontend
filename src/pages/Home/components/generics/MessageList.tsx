import React, { useEffect, useRef, useState } from "react";
import { Message as MessageType } from "../../../../shared/entities/ChatTypes";
import Message from "./ChatMessage";

// TODO : Mettre les types des messages dans le fichier src/types/ChatTypes.ts

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  useEffect(() => {
    const currentMessageCount = messages.length;

    // Si c'est le chargement initial ou si on passe de 0 à plusieurs messages
    if (isInitialLoad || (previousMessageCount === 0 && currentMessageCount > 0)) {
      // Scroll instantané pour le chargement initial
      messageEndRef.current?.scrollIntoView({ behavior: "instant" });
      setIsInitialLoad(false);
    }
    // Si de nouveaux messages ont été ajoutés (pas le premier chargement)
    else if (currentMessageCount > previousMessageCount && previousMessageCount > 0) {
      // Scroll smooth uniquement pour les nouveaux messages
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setPreviousMessageCount(currentMessageCount);
  }, [messages, isInitialLoad, previousMessageCount]);

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
