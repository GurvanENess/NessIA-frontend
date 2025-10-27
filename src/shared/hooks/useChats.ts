import {
  ChatConversation,
  ChatsState,
} from "../../pages/Chats/entities/ChatTypes";
import { useApp } from "../contexts/AppContext";

interface UseChatsReturn extends ChatsState {
  fetchChats: (chats: ChatConversation[]) => void;
  setSort: (
    sortBy: ChatsState["sortBy"],
    sortOrder: ChatsState["sortOrder"]
  ) => void;
  deleteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

/**
 * Hook pour gérer les chats via le store global de l'application
 * Remplace l'ancien useChatsStore pour éviter les instances multiples du reducer
 */
export const useChats = (): UseChatsReturn => {
  const { state, dispatch } = useApp();

  const fetchChats = (chats: ChatConversation[]) => {
    if (chats.length === 0) {
      dispatch({ type: "FETCH_CHATS_START" });
    } else {
      dispatch({ type: "FETCH_CHATS_SUCCESS", payload: chats });
    }
  };

  const setSort = (
    sortBy: ChatsState["sortBy"],
    sortOrder: ChatsState["sortOrder"]
  ) => {
    dispatch({ type: "SET_CHATS_SORT", payload: { sortBy, sortOrder } });
  };

  const deleteChat = (chatId: string) => {
    dispatch({ type: "DELETE_CHAT", payload: chatId });
  };

  const archiveChat = (chatId: string) => {
    dispatch({ type: "ARCHIVE_CHAT", payload: chatId });
  };

  const renameChat = (chatId: string, newTitle: string) => {
    dispatch({ type: "RENAME_CHAT", payload: { id: chatId, newTitle } });
  };

  return {
    ...state.chats,
    fetchChats,
    setSort,
    deleteChat,
    archiveChat,
    renameChat,
  };
};
