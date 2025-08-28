import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../shared/contexts/AppContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import { db } from "../../shared/services/db";
import ChatsGrid from "./components/ChatsGrid";
import ChatsHeader from "./components/ChatsHeader";
import { ChatConversation } from "./entities/ChatTypes";
import { ChatsService } from "./services/chatsService";
import { useChatsStore } from "./store/chatsStore";
import { formatChatsforUi } from "./utils/utils";

const ChatsDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dispatch, state } = useApp();

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
          const userChats = await db.getAllChats(
            state.currentCompany?.id as string
          );
          const userChatsFormated = formatChatsforUi(userChats); // A bouger dans les services

          fetchChats(userChatsFormated);
        } catch (err) {
          toast.error("Erreur lors du chargement des conversations");
          logger.error("Failed to load chats", err);
        }
      }
    };

    loadChats();
  }, [user?.id, state.currentCompany?.id]);

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

  // A dégager
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
        logger.error("Failed to archive chat", err);
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
        const response = await db.deleteChatById(
          chatId,
          state.currentCompany?.id as string
        );
        deleteChat(chatId);
      } catch (err) {
        logger.error("Failed to delete chat", err);
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
