import { useReducer } from 'react';
import { Post, PostsState } from '../entities/PostTypes';

type PostsAction =
  | { type: 'FETCH_POSTS_START' }
  | { type: 'FETCH_POSTS_SUCCESS'; payload: Post[] }
  | { type: 'FETCH_POSTS_ERROR'; payload: string }
  | { type: 'SET_SORT'; payload: { sortBy: PostsState['sortBy']; sortOrder: PostsState['sortOrder'] } }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'UPDATE_POST_STATUS'; payload: { id: string; status: Post['status'] } };

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  sortBy: 'date',
  sortOrder: 'desc'
};

const postsReducer = (state: PostsState, action: PostsAction): PostsState => {
  switch (action.type) {
    case 'FETCH_POSTS_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        posts: action.payload,
        error: null
      };

    case 'FETCH_POSTS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'SET_SORT':
      const sortedPosts = [...state.posts].sort((a, b) => {
        let comparison = 0;
        
        switch (action.payload.sortBy) {
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
        
        return action.payload.sortOrder === 'asc' ? comparison : -comparison;
      });

      return {
        ...state,
        posts: sortedPosts,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };

    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      };

    case 'UPDATE_POST_STATUS':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, status: action.payload.status, updatedAt: new Date() }
            : post
        )
      };

    default:
      return state;
  }
};

export const usePostsStore = () => {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const fetchPosts = (posts: Post[]) => {
    if (posts.length === 0) {
      dispatch({ type: 'FETCH_POSTS_START' });
    } else {
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: posts });
    }
  };

  const setPostsError = (error: string) => {
    dispatch({ type: 'FETCH_POSTS_ERROR', payload: error });
  };

  const setSort = (sortBy: PostsState['sortBy'], sortOrder: PostsState['sortOrder']) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  };

  const deletePost = (postId: string) => {
    dispatch({ type: 'DELETE_POST', payload: postId });
  };

  const updatePostStatus = (id: string, status: Post['status']) => {
    dispatch({ type: 'UPDATE_POST_STATUS', payload: { id, status } });
  };

  return {
    ...state,
    fetchPosts,
    setPostsError,
    setSort,
    deletePost,
    updatePostStatus
  };
};