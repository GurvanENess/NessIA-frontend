export const formatChatsforUi = (chats: any[]) => {
  return chats.map((chat) => ({
    id: chat.id,
    title: chat.title || "Conversation sans titre",
    associatedPostId: chat.post_id || null,
    lastMessage: chat.summary || "Aucun sommaire disponible",
    lastMessageDate: chat.last_message_date || new Date(),
    messageCount: chat.message[0].count || 0,
    isActive: true,
    userId: "1",
    createdAt: chat.created_at ? new Date(chat.created_at) : new Date(),
    updatedAt: chat.updated_at ? new Date(chat.updated_at) : new Date(),
  }));
};
