import { create } from 'zustand';
import { Post, PostsState } from '../entities/PostTypes';
import { handleError } from '../../../shared/utils/errorHandler';

interface PostsStore extends PostsState {
  fetchPosts: (posts: Post[]) => void;
  startFetchLoading: () => void;
  setSort: (sortBy: PostsState['sortBy'], sortOrder: PostsState['sortOrder']) => void;
  deletePost: (postId: string) => void;
  updatePostStatus: (id: string, status: Post['status']) => void;
  setError: (error: unknown, message: string) => void;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

export const usePostsStore = create<PostsStore>((set) => ({
  ...initialState,
  fetchPosts: (posts) => {
    if (posts.length === 0) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoading: false, posts, error: null });
    }
  },
  startFetchLoading: () => set({ isLoading: true, error: null }),
  setSort: (sortBy, sortOrder) =>
    set((state) => {
      const sortedPosts = [...state.posts].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'date':
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'platform':
            comparison = a.platform.localeCompare(b.platform);
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      return { posts: sortedPosts, sortBy, sortOrder };
    }),
  deletePost: (postId) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
  updatePostStatus: (id, status) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, status, updatedAt: new Date() } : post
      ),
    })),
  setError: (error, message) => {
    const summary = handleError(error, message);
    set({ isLoading: false, error: summary });
  },
}));
