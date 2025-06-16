// This file maintains backward compatibility with existing PostEditor
export interface BasePostData {
  image: string;
  caption: string;
  hashtags: string;
}

// Re-export from Posts page for consistency
export type { Post, PostStatus, PostPlatform } from '../../pages/Posts/entities/PostTypes';