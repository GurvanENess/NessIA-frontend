import { create } from 'zustand';
import { ChatConversation, ChatsState } from '../entities/ChatTypes';

interface ChatsStore extends ChatsState {
  fetchChats: (chats: ChatConversation[]) => void;
  setSort: (sortBy: ChatsState['sortBy'], sortOrder: ChatsState['sortOrder']) => void;
  deleteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

const initialState: ChatsState = {
  conversations: [],
  isLoading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useChatsStore = create<ChatsStore>((set) => ({
  ...initialState,
  fetchChats: (chats) => {
    if (chats.length === 0) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoading: false, conversations: chats, error: null });
    }
  },
  setSort: (sortBy, sortOrder) =>
    set((state) => {
      const sortedChats = [...state.conversations].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'date':
            comparison = a.lastMessageDate.getTime() - b.lastMessageDate.getTime();
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'activity':
            comparison = a.messageCount - b.messageCount;
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      return { conversations: sortedChats, sortBy, sortOrder };
    }),
  deleteChat: (chatId) =>
    set((state) => ({
      conversations: state.conversations.filter((chat) => chat.id !== chatId),
    })),
  archiveChat: (chatId) =>
    set((state) => ({
      conversations: state.conversations.map((chat) =>
        chat.id === chatId
          ? { ...chat, isActive: false, updatedAt: new Date() }
          : chat
      ),
    })),
  renameChat: (chatId, newTitle) =>
    set((state) => ({
      conversations: state.conversations.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: newTitle, updatedAt: new Date() }
          : chat
      ),
    })),
}));
