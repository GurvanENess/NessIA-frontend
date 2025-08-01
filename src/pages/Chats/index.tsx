import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useChatsStore } from "./store/chatsStore";
import { ChatsService } from "./services/chatsService";
import { ChatConversation } from "./entities/ChatTypes";
import { db } from "../../shared/services/db";
import ChatsHeader from "./components/ChatsHeader";
import ChatsGrid from "./components/ChatsGrid";
import { formatChatsforUi } from "./utils/utils";
import toast from "react-hot-toast";
import { useApp } from "../../shared/contexts/AppContext";

const ChatsDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dispatch } = useApp();

  const {
    conversations,
    isLoading,
    error,
    sortBy,
    sortOrder,
    fetchChats,
    setSort,
    deleteChat,
    archiveChat,
  } = useChatsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatConversation[]>([]);

  // Load chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      if (user?.id) {
        fetchChats([]); // Start loading state
        try {
          const userChats = await db.getAllChats();
          const userChatsFormated = formatChatsforUi(userChats); // A bouger dans les services

          fetchChats(userChatsFormated);
        } catch (err) {
          console.error("Failed to load chats:", err);
          // Even if there's an error, we can still show mock data for demo
        }
      }
    };

    loadChats();
  }, [user?.id]);

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(conversations);
    } else {
      const filtered = conversations.filter(
        (chat) =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [conversations, searchQuery]);

  const handleCreateNew = () => {
    dispatch({ type: "RESET_CHAT" });
    navigate("/");
  };

  const handleViewChat = (chatId: string) => {
    navigate(`/chats/${chatId}`);
  };

  const handleViewPost = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const handleArchive = async (chatId: string) => {
    const chat = conversations.find((c) => c.id === chatId);
    const action = chat?.isActive ? "archiver" : "désarchiver";

    if (
      window.confirm(`Êtes-vous sûr de vouloir ${action} cette conversation ?`)
    ) {
      try {
        await ChatsService.archiveChat(chatId);
        archiveChat(chatId);
      } catch (err) {
        console.error("Failed to archive chat:", err);
      }
    }
  };

  const handleDelete = async (chatId: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
      )
    ) {
      try {
        await ChatsService.deleteChat(chatId);
        deleteChat(chatId);
      } catch (err) {
        console.error("Failed to delete chat:", err);
      }
    }
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/chats/${chatId}`);
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
        <ChatsHeader
          totalChats={filteredChats.length}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onCreateNew={handleCreateNew}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ChatsGrid
          chats={filteredChats}
          isLoading={isLoading}
          error={error}
          onViewChat={handleViewChat}
          onViewPost={handleViewPost}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onChatClick={handleChatClick}
        />
      </div>
    </motion.div>
  );
};

export default ChatsDisplay;
