import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { ChatConversation } from '../entities/ChatTypes';
import ChatCard from './ChatCard';

interface ChatsGridProps {
  chats: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  onViewChat: (chatId: string) => void;
  onViewPost: (postId: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onChatClick: (chatId: string) => void;
}

const ChatsGrid: React.FC<ChatsGridProps> = ({
  chats,
  isLoading,
  error,
  onViewChat,
  onViewPost,
  onArchive,
  onDelete,
  onChatClick
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Chargement des conversations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <div className="text-red-600 mb-2">
          <MessageCircle className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-semibold">Erreur de chargement</h3>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
      </motion.div>
    );
  }

  if (chats.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
      >
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune conversation trouvée
        </h3>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas encore de conversations. Commencez par créer votre première conversation !
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D28D9] transition-colors"
        >
          Créer ma première conversation
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ChatCard
              chat={chat}
              onViewChat={onViewChat}
              onViewPost={onViewPost}
              onArchive={onArchive}
              onDelete={onDelete}
              onChatClick={onChatClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatsGrid;