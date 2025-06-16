export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageDate: Date;
  associatedPostId?: string;
  userId: string;
  isActive: boolean;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatsState {
  conversations: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  sortBy: 'date' | 'title' | 'activity';
  sortOrder: 'asc' | 'desc';
}