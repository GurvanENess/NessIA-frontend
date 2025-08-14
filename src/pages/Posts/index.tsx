import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../shared/contexts/AppContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import { db } from "../../shared/services/db";
import PostsGrid from "./components/PostsGrid";
import PostsHeader from "./components/PostsHeader";
import { Post } from "./entities/PostTypes";
import { PostsService } from "./services/postsService";
import { usePostsStore } from "./store/postsStore";

const PostsDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useApp();
  const {
    posts,
    isLoading,
    error,
    sortBy,
    sortOrder,
    startFetchLoading,
    fetchPosts,
    setSort,
    deletePost,
    setError,
  } = usePostsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      startFetchLoading();
      try {
        const userPosts = await PostsService.fetchUserPosts(
          state.currentCompany?.id as string
        );
        fetchPosts(userPosts);
      } catch (err) {
        setError(err, "Impossible de charger les publications");
      }
    };

    loadPosts();
  }, [user?.id, state.currentCompany?.id]);

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

  const handleCreateNew = () => {
    navigate("/post/new");
  };

  const handleEdit = (post: Post) => {
    // Navigate to edit page with post data
    navigate(`/post/edit/${post.id}`, { state: { post } });
  };

  const handleDelete = async (postId: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")
    ) {
      try {
        await db.deletePostById(postId, state.currentCompany?.id as string);
        deletePost(postId);
      } catch (err) {
        setError(err, "Impossible de supprimer la publication");
      }
    }
  };

  const handleViewChat = (chatId: string) => {
    navigate(`/chats/${chatId}`);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };
  const handleSortChange = (
    newSortBy: typeof sortBy,
    newSortOrder: typeof sortOrder
  ) => {
    setSort(newSortBy, newSortOrder);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-[#E7E9F2] p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <PostsHeader
          totalPosts={filteredPosts.length}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onCreateNew={handleCreateNew}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <PostsGrid
          posts={filteredPosts}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewChat={handleViewChat}
          onPostClick={handlePostClick}
        />
      </div>
    </motion.div>
  );
};

export default PostsDisplay;
