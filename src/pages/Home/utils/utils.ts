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

const isMessageEmpty = (message: string): Boolean => {
  return !message || message.trim().length === 0;
};

export { formatMessagesFromDb, isMessageEmpty };
