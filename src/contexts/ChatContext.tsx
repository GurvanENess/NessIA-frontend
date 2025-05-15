import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  reactions: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    thumbnail?: string;
  }[];
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  draftMessage: string;
}

type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DRAFT_MESSAGE'; payload: string }
  | { type: 'ADD_REACTION'; payload: { messageId: string; reactionType: string } };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  draftMessage: '',
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DRAFT_MESSAGE':
      return { ...state, draftMessage: action.payload };
    case 'ADD_REACTION':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? {
                ...message,
                reactions: message.reactions.map(reaction =>
                  reaction.type === action.payload.reactionType
                    ? { ...reaction, count: reaction.count + 1, userReacted: true }
                    : reaction
                ),
              }
            : message
        ),
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}