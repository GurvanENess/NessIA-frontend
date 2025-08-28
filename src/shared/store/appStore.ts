import { create } from "zustand";
import { ChatConversation } from "../../pages/Chats/entities/ChatTypes";
import { Message } from "../entities/ChatTypes";
import { Company } from "../entities/CompanyTypes";
import { PostData } from "../entities/PostTypes";
import { handleError } from "../utils/errorHandler";

interface PostState {
  isPreviewMode: boolean;
  postData: PostData;
  isSaving: boolean;
  isPublishing: boolean;
  error: string | null;
}

interface ChatState {
  sessionId: string | null;
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

interface AppStore {
  post: PostState;
  chat: ChatState;
  postPanel: PostPanelState;
  currentCompany: Company | null;
  conversations: ChatConversation[];
  error: string | null;
  setChatSessionId: (id: string) => void;
  clearChatSessionId: () => void;
  setPreviewMode: (isPreview: boolean) => void;
  updatePostData: (data: Partial<PostData>) => void;
  savePostStart: () => void;
  savePostSuccess: () => void;
  savePostError: (msg: string) => void;
  publishPostStart: () => void;
  publishPostSuccess: () => void;
  publishPostError: (msg: string) => void;
  setMessageInput: (input: string) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setChatLoading: (val: boolean) => void;
  setChatError: (msg: string | null) => void;
  hideQuickActions: () => void;
  showQuickActions: () => void;
  resetChat: () => void;
  setCurrentCompany: (company: Company) => void;
  clearCurrentCompany: () => void;
  changeCompanyAndReset: (company: Company) => void;
  openPostPanel: (id: string) => void;
  closePostPanel: () => void;
  fetchChats: (chats: ChatConversation[]) => void;
  setGlobalError: (error: unknown, message: string) => void;
  clearGlobalError: () => void;
}

const CURRENT_COMPANY_KEY = "nessia_current_company";

const initialPost: PostState = {
  isPreviewMode: false,
  postData: {
    image: "",
    caption: "",
    hashtags: "",
  },
  isSaving: false,
  isPublishing: false,
  error: null,
};

const initialChat: ChatState = {
  sessionId: null,
  messages: [],
  messageInput: "",
  isLoading: false,
  error: null,
  showQuickActions: true,
};

const initialPostPanel: PostPanelState = {
  isOpen: false,
  postId: null,
};

const loadCompany = (): Company | null => {
  try {
    const raw = localStorage.getItem(CURRENT_COMPANY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  post: initialPost,
  chat: initialChat,
  postPanel: initialPostPanel,
  currentCompany: loadCompany(),
  conversations: [],
  error: null,
  setChatSessionId: (id) =>
    set((state) => ({ chat: { ...state.chat, sessionId: id } })),
  clearChatSessionId: () =>
    set((state) => ({ chat: { ...state.chat, sessionId: "" } })),
  setPreviewMode: (isPreview) =>
    set((state) => ({ post: { ...state.post, isPreviewMode: isPreview } })),
  updatePostData: (data) =>
    set((state) => ({
      post: { ...state.post, postData: { ...state.post.postData, ...data } },
    })),
  savePostStart: () =>
    set((state) => ({ post: { ...state.post, isSaving: true, error: null } })),
  savePostSuccess: () =>
    set((state) => ({ post: { ...state.post, isSaving: false } })),
  savePostError: (msg) =>
    set((state) => ({ post: { ...state.post, isSaving: false, error: msg } })),
  publishPostStart: () =>
    set((state) => ({
      post: { ...state.post, isPublishing: true, error: null },
    })),
  publishPostSuccess: () =>
    set((state) => ({ post: { ...state.post, isPublishing: false } })),
  publishPostError: (msg) =>
    set((state) => ({
      post: { ...state.post, isPublishing: false, error: msg },
    })),
  setMessageInput: (input) =>
    set((state) => ({ chat: { ...state.chat, messageInput: input } })),
  addMessage: (msg) =>
    set((state) => ({
      chat: { ...state.chat, messages: [...state.chat.messages, msg] },
    })),
  setMessages: (msgs) =>
    set((state) => ({ chat: { ...state.chat, messages: msgs } })),
  setChatLoading: (val) =>
    set((state) => ({ chat: { ...state.chat, isLoading: val } })),
  setChatError: (msg) =>
    set((state) => ({ chat: { ...state.chat, error: msg } })),
  hideQuickActions: () =>
    set((state) => ({ chat: { ...state.chat, showQuickActions: false } })),
  showQuickActions: () =>
    set((state) => ({ chat: { ...state.chat, showQuickActions: true } })),
  resetChat: () =>
    set(() => ({
      post: initialPost,
      chat: initialChat,
      postPanel: initialPostPanel,
      currentCompany: get().currentCompany,
      conversations: [],
      error: null,
    })),
  setCurrentCompany: (company) => {
    try {
      localStorage.setItem(CURRENT_COMPANY_KEY, JSON.stringify(company));
    } catch {
      /* ignore */
    }
    set({ currentCompany: company });
  },
  clearCurrentCompany: () => {
    localStorage.removeItem(CURRENT_COMPANY_KEY);
    set({ currentCompany: null });
  },
  changeCompanyAndReset: (company) => {
    try {
      localStorage.setItem(CURRENT_COMPANY_KEY, JSON.stringify(company));
    } catch {
      /* ignore */
    }
    set({
      post: initialPost,
      chat: initialChat,
      postPanel: initialPostPanel,
      currentCompany: company,
      conversations: [],
      error: null,
    });
  },
  openPostPanel: (id) => set({ postPanel: { isOpen: true, postId: id } }),
  closePostPanel: () => set({ postPanel: { isOpen: false, postId: null } }),
  fetchChats: (chats) => set({ conversations: chats }),
  setGlobalError: (error, message) => {
    const summary = handleError(error, message);
    set({ error: summary });
  },
  clearGlobalError: () => set({ error: null }),
}));
