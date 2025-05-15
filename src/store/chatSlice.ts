import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  draftMessage: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDraftMessage: (state, action: PayloadAction<string>) => {
      state.draftMessage = action.payload;
    },
    addReaction: (state, action: PayloadAction<{ messageId: string; reactionType: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.messageId);
      if (message) {
        const reaction = message.reactions.find(r => r.type === action.payload.reactionType);
        if (reaction) {
          reaction.count += 1;
          reaction.userReacted = true;
        }
      }
    },
  },
});

export const {
  setMessages,
  addMessage,
  setLoading,
  setError,
  setDraftMessage,
  addReaction,
} = chatSlice.actions;

export default chatSlice.reducer;