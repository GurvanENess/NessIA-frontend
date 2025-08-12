import { useReducer } from 'react';
import { ChatConversation, ChatsState } from '../entities/ChatTypes';

type ChatsAction =
  | { type: 'FETCH_CHATS_START' }
  | { type: 'FETCH_CHATS_SUCCESS'; payload: ChatConversation[] }
  | { type: 'FETCH_CHATS_ERROR'; payload: string }
  | { type: 'SET_SORT'; payload: { sortBy: ChatsState['sortBy']; sortOrder: ChatsState['sortOrder'] } }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'ARCHIVE_CHAT'; payload: string }
  | { type: 'RENAME_CHAT'; payload: { id: string; newTitle: string } };

const initialState: ChatsState = {
  conversations: [],
  isLoading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc'
};

const chatsReducer = (state: ChatsState, action: ChatsAction): ChatsState => {
  switch (action.type) {
    case 'FETCH_CHATS_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'FETCH_CHATS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        conversations: action.payload,
        error: null
      };

    case 'FETCH_CHATS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'SET_SORT':
      const sortedChats = [...state.conversations].sort((a, b) => {
        let comparison = 0;
        
        switch (action.payload.sortBy) {
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
        
        return action.payload.sortOrder === 'asc' ? comparison : -comparison;
      });

      return {
        ...state,
        conversations: sortedChats,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };

    case 'DELETE_CHAT':
      return {
        ...state,
        conversations: state.conversations.filter(chat => chat.id !== action.payload)
      };

    case 'ARCHIVE_CHAT':
      return {
        ...state,
        conversations: state.conversations.map(chat =>
          chat.id === action.payload
            ? { ...chat, isActive: false, updatedAt: new Date() }
            : chat
        )
      };

    case 'RENAME_CHAT':
      return {
        ...state,
        conversations: state.conversations.map(chat =>
          chat.id === action.payload.id
            ? { ...chat, title: action.payload.newTitle, updatedAt: new Date() }
            : chat
        )
      };

    default:
      return state;
  }
};

export const useChatsStore = () => {
  const [state, dispatch] = useReducer(chatsReducer, initialState);

  const fetchChats = (chats: ChatConversation[]) => {
    if (chats.length === 0) {
      dispatch({ type: 'FETCH_CHATS_START' });
    } else {
      dispatch({ type: 'FETCH_CHATS_SUCCESS', payload: chats });
    }
  };

  const setSort = (sortBy: ChatsState['sortBy'], sortOrder: ChatsState['sortOrder']) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  };

  const deleteChat = (chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  };

  const archiveChat = (chatId: string) => {
    dispatch({ type: 'ARCHIVE_CHAT', payload: chatId });
  };

  const renameChat = (chatId: string, newTitle: string) => {
    dispatch({ type: 'RENAME_CHAT', payload: { id: chatId, newTitle } });
  };

  return {
    ...state,
    fetchChats,
    setSort,
    deleteChat,
    archiveChat,
    renameChat
  };
};