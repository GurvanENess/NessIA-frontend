import { Message } from "../../../shared/entities/ChatTypes";

const formatMessagesFromDb = (messages: unknown[]): Message[] => {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  return messages.map((message: any) => ({
    id: message.id,
    isAi: message.role === "assistant",
    content: message.content,
    timestamp: new Date(message.created_at),
    showActions: false,
    action: undefined,
    handleAction: undefined,
    postData: undefined,
  }));
};

const formatMessageToDb = (
  message: Message,
  userId: string,
  sessionId: string
): unknown => {
  return {
    id: Math.round(Math.random() * 1_000_000),
    content: message.content,
    role: message.isAi ? "assistant" : "user",
    session_id: sessionId,
    user_id: userId,
    created_at: message.timestamp,
  };
};

export { formatMessagesFromDb, formatMessageToDb };
