import {
  ChatConversation,
  ChatsState,
} from "../../pages/Chats/entities/ChatTypes";
import { Message } from "../entities/ChatTypes";
import { PostData } from "../entities/PostTypes";

// Types
export interface Company {
  id: string;
  name: string;
  email?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface PostState {
  isPreviewMode: boolean;
  postData: PostData;
  isSaving: boolean;
  isPublishing: boolean;
  error: string | null;
}

interface ChatState {
  sessionId?: string | null;
  messages: Message[];
  messageInput: string;
  isLoading: boolean;
  error: string | null;
  showQuickActions: boolean;
}

interface PostPanelState {
  isOpen: boolean;
  postId: string | null;
}

export interface AppState {
  post: PostState;
  chat: ChatState;
  chats: ChatsState;
  postPanel: PostPanelState;
  currentCompany: Company | null;
  error: string | null;
}

// Action Types
export type PostAction =
  | { type: "SET_CHAT_SESSION_ID"; payload: string }
  | { type: "CLEAR_CHAT_SESSION_ID" }
  | { type: "SET_PREVIEW_MODE"; payload: boolean }
  | { type: "UPDATE_POST_DATA"; payload: Partial<PostData> }
  | { type: "SAVE_POST_START" }
  | { type: "SAVE_POST_SUCCESS" }
  | { type: "SAVE_POST_ERROR"; payload: string }
  | { type: "PUBLISH_POST_START" }
  | { type: "PUBLISH_POST_SUCCESS" }
  | { type: "PUBLISH_POST_ERROR"; payload: string };

export type ChatAction =
  | { type: "SET_MESSAGE_INPUT"; payload: string }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "HIDE_QUICK_ACTIONS" }
  | { type: "SHOW_QUICK_ACTIONS" }
  | { type: "RESET_CHAT" };

export type CompanyAction =
  | { type: "SET_CURRENT_COMPANY"; payload: Company }
  | { type: "CLEAR_CURRENT_COMPANY" }
  | { type: "CHANGE_COMPANY_AND_RESET"; payload: Company };

export type PostPanelAction =
  | { type: "OPEN_POST_PANEL"; payload: string }
  | { type: "CLOSE_POST_PANEL" };

export type ChatsAction =
  | { type: "FETCH_CHATS_START" }
  | { type: "FETCH_CHATS_SUCCESS"; payload: ChatConversation[] }
  | { type: "FETCH_CHATS_ERROR"; payload: string }
  | {
      type: "SET_CHATS_SORT";
      payload: {
        sortBy: ChatsState["sortBy"];
        sortOrder: ChatsState["sortOrder"];
      };
    }
  | { type: "DELETE_CHAT"; payload: string }
  | { type: "ARCHIVE_CHAT"; payload: string }
  | { type: "RENAME_CHAT"; payload: { id: string; newTitle: string } };

export type AppAction =
  | PostAction
  | ChatAction
  | ChatsAction
  | CompanyAction
  | PostPanelAction
  | { type: "SET_GLOBAL_ERROR"; payload: string }
  | { type: "CLEAR_GLOBAL_ERROR" };

// Initial State
export const initialState: AppState = {
  post: {
    isPreviewMode: false,
    postData: {
      image: "",
      caption: "",
      hashtags: "",
    },
    isSaving: false,
    isPublishing: false,
    error: null,
  },
  chat: {
    sessionId: null,
    messages: [],
    messageInput: "",
    isLoading: false,
    error: null,
    showQuickActions: true,
  },
  chats: {
    conversations: [],
    isLoading: false,
    error: null,
    sortBy: "date",
    sortOrder: "desc",
  },
  postPanel: {
    isOpen: false,
    postId: null,
  },
  currentCompany: null,
  error: null,
};

// Reducer
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Post Actions
    case "SET_CHAT_SESSION_ID":
      return {
        ...state,
        chat: {
          ...state.chat,
          sessionId: action.payload,
        },
      };
    case "CLEAR_CHAT_SESSION_ID":
      return {
        ...state,
        chat: {
          ...state.chat,
          sessionId: "",
        },
      };
    case "SET_PREVIEW_MODE":
      return {
        ...state,
        post: {
          ...state.post,
          isPreviewMode: action.payload,
        },
      };

    case "UPDATE_POST_DATA":
      return {
        ...state,
        post: {
          ...state.post,
          postData: {
            ...state.post.postData,
            ...action.payload,
          },
        },
      };

    case "SAVE_POST_START":
      return {
        ...state,
        post: {
          ...state.post,
          isSaving: true,
          error: null,
        },
      };

    case "SAVE_POST_SUCCESS":
      return {
        ...state,
        post: {
          ...state.post,
          isSaving: false,
          error: null,
        },
      };

    case "SAVE_POST_ERROR":
      return {
        ...state,
        post: {
          ...state.post,
          isSaving: false,
          error: action.payload,
        },
      };

    case "PUBLISH_POST_START":
      return {
        ...state,
        post: {
          ...state.post,
          isPublishing: true,
          error: null,
        },
      };

    case "PUBLISH_POST_SUCCESS":
      return {
        ...state,
        post: {
          ...state.post,
          isPublishing: false,
          error: null,
        },
      };

    case "PUBLISH_POST_ERROR":
      return {
        ...state,
        post: {
          ...state.post,
          isPublishing: false,
          error: action.payload,
        },
      };

    // Chat Actions
    case "SET_MESSAGE_INPUT":
      return {
        ...state,
        chat: {
          ...state.chat,
          messageInput: action.payload,
        },
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
        },
      };

    case "SET_MESSAGES":
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: action.payload,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        chat: {
          ...state.chat,
          isLoading: action.payload,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        chat: {
          ...state.chat,
          error: action.payload,
        },
      };

    case "HIDE_QUICK_ACTIONS":
      return {
        ...state,
        chat: {
          ...state.chat,
          showQuickActions: false,
        },
      };

    case "SHOW_QUICK_ACTIONS":
      return {
        ...state,
        chat: {
          ...state.chat,
          showQuickActions: true,
        },
      };

    case "RESET_CHAT":
      return {
        ...initialState,
        currentCompany: state.currentCompany, // Preserve current company on chat reset
      };

    // Company Actions
    case "SET_CURRENT_COMPANY":
      return {
        ...state,
        currentCompany: action.payload,
      };

    case "CLEAR_CURRENT_COMPANY":
      return {
        ...state,
        currentCompany: null,
      };

    case "CHANGE_COMPANY_AND_RESET":
      return {
        ...initialState,
        currentCompany: action.payload, // Garde la nouvelle compagnie
        // Tous les autres états sont réinitialisés
      };

    case "SET_GLOBAL_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_GLOBAL_ERROR":
      return {
        ...state,
        error: null,
      };

    // Post Panel Actions
    case "OPEN_POST_PANEL":
      return {
        ...state,
        postPanel: {
          isOpen: true,
          postId: action.payload,
        },
      };

    case "CLOSE_POST_PANEL":
      return {
        ...state,
        postPanel: {
          isOpen: false,
          postId: null,
        },
      };

    // Chats Actions
    case "FETCH_CHATS_START":
      return {
        ...state,
        chats: {
          ...state.chats,
          isLoading: true,
          error: null,
        },
      };

    case "FETCH_CHATS_SUCCESS":
      return {
        ...state,
        chats: {
          ...state.chats,
          isLoading: false,
          conversations: action.payload,
          error: null,
        },
      };

    case "FETCH_CHATS_ERROR":
      return {
        ...state,
        chats: {
          ...state.chats,
          isLoading: false,
          error: action.payload,
        },
      };

    case "SET_CHATS_SORT":
      const sortedChats = [...state.chats.conversations].sort((a, b) => {
        let comparison = 0;

        switch (action.payload.sortBy) {
          case "date":
            comparison =
              a.lastMessageDate.getTime() - b.lastMessageDate.getTime();
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "activity":
            comparison = a.messageCount - b.messageCount;
            break;
        }

        return action.payload.sortOrder === "asc" ? comparison : -comparison;
      });

      return {
        ...state,
        chats: {
          ...state.chats,
          conversations: sortedChats,
          sortBy: action.payload.sortBy,
          sortOrder: action.payload.sortOrder,
        },
      };

    case "DELETE_CHAT":
      return {
        ...state,
        chats: {
          ...state.chats,
          conversations: state.chats.conversations.filter(
            (chat) => chat.id !== action.payload
          ),
        },
      };

    case "ARCHIVE_CHAT":
      return {
        ...state,
        chats: {
          ...state.chats,
          conversations: state.chats.conversations.map((chat) =>
            chat.id === action.payload
              ? { ...chat, isActive: false, updatedAt: new Date() }
              : chat
          ),
        },
      };

    case "RENAME_CHAT":
      return {
        ...state,
        chats: {
          ...state.chats,
          conversations: state.chats.conversations.map((chat) =>
            chat.id === action.payload.id
              ? {
                  ...chat,
                  title: action.payload.newTitle,
                  updatedAt: new Date(),
                }
              : chat
          ),
        },
      };

    default:
      return state;
  }
};
