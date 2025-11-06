import { Media } from "../../../shared/entities/MediaTypes";
import { PostPlatform } from "../../../shared/entities/PostTypes";

export type PostStatus = "draft" | "published" | "scheduled";

export interface Post {
  id: string;
  title: string;
  description: string;
  status: PostStatus;
  platform: PostPlatform;
  platformId?: number | null;
  createdAt: Date;
  updatedAt?: Date;
  scheduledAt?: Date;
  publishedAt?: Date;
  images?: Media[];
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
