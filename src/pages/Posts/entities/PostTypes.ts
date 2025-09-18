export type PostStatus = "draft" | "published" | "scheduled";
export type PostPlatform = "instagram" | "facebook" | "tiktok" | "twitter";

export interface Post {
  id: string;
  title: string;
  description: string;
  status: PostStatus;
  platform: PostPlatform;
  createdAt: Date;
  updatedAt?: Date;
  scheduledAt?: Date;
  publishedAt?: Date;
  images?: { id: string; url: string }[];
  hashtags?: string[];
  userId: string;
  conversationId?: string;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  sortBy: "date" | "status" | "platform";
  sortOrder: "asc" | "desc";
}
