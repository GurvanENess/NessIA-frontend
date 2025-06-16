export type PostStatus = 'draft' | 'published' | 'scheduled';
export type PostPlatform = 'instagram' | 'facebook' | 'tiktok' | 'twitter';

export interface Post {
  id: string;
  title: string;
  description: string;
  status: PostStatus;
  platform: PostPlatform;
  associatedChatId: string;
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
  publishedAt?: Date;
  imageUrl?: string;
  userId: string;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  sortBy: 'date' | 'status' | 'platform';
  sortOrder: 'asc' | 'desc';
}