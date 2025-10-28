export const formatChatsforUi = (chats: any[]) => {
  return chats
    .map((chat) => ({
      id: chat.id,
      title: chat.title || "Conversation sans titre",
      associatedPostId: chat.post ? chat.post.id : null,
      lastMessage: chat.summary || "Aucun sommaire disponible",
      // Utilise la date du dernier message (last_message.created_at) si disponible, sinon created_at
      lastMessageDate: chat.last_message?.created_at
        ? new Date(chat.last_message.created_at)
        : new Date(chat.created_at),
      messageCount: chat.message[0].count || 0,
      isActive: true,
      userId: "1",
      createdAt: chat.created_at ? new Date(chat.created_at) : new Date(),
      updatedAt: chat.updated_at ? new Date(chat.updated_at) : new Date(),
    }))
    .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());
};
