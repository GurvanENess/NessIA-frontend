import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar: string;
  timestamp: string;
  reactions: Record<string, string[]>;
  attachments?: { url: string; type: string }[];
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  draft: string;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  draft: localStorage.getItem('chatDraft') || '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDraft: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
      localStorage.setItem('chatDraft', action.payload);
    },
    addReaction: (state, action: PayloadAction<{ messageId: string; reaction: string; userId: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.messageId);
      if (message) {
        if (!message.reactions[action.payload.reaction]) {
          message.reactions[action.payload.reaction] = [];
        }
        message.reactions[action.payload.reaction].push(action.payload.userId);
      }
    },
  },
});

export const { setMessages, addMessage, setLoading, setError, setDraft, addReaction } = chatSlice.actions;
export default chatSlice.reducer;