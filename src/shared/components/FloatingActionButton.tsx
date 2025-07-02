import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { ChatsService } from '../../pages/Chats/services/chatsService';

interface FloatingActionButtonProps {
  type: 'post' | 'chat';
  id: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ type, id }) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [associatedId, setAssociatedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistence = async () => {
      setIsLoading(true);
      try {
        if (type === 'post') {
          // Check if post exists and get associated chat ID
          const post = await db.getPostById(id);
          if (post) {
            setExists(true);
            // In a real app, you'd get the associated chat ID from the post data
            // For now, we'll simulate finding an associated chat
            const chats = await ChatsService.fetchUserChats('user-123');
            const associatedChat = chats.find(chat => chat.associatedPostId === id);
            setAssociatedId(associatedChat?.id || null);
          } else {
            setExists(false);
          }
        } else if (type === 'chat') {
          // Check if chat exists and get associated post ID
          const chat = await ChatsService.fetchChatById(id);
          if (chat) {
            setExists(true);
            setAssociatedId(chat.associatedPostId || null);
          } else {
            setExists(false);
          }
        }
      } catch (error) {
        console.error(`Error checking ${type} existence:`, error);
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistence();
  }, [type, id]);

  const handleClick = () => {
    if (type === 'post' && associatedId) {
      // Navigate from post to its associated chat
      navigate(`/chats/${associatedId}`);
    } else if (type === 'chat' && associatedId) {
      // Navigate from chat to its associated post
      navigate(`/posts/${associatedId}`);
    } else if (type === 'post') {
      // If no associated chat, navigate to chats list
      navigate('/chats');
    } else {
      // If no associated post, navigate to posts list
      navigate('/posts');
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-6 h-6 animate-spin" />;
    }
    
    if (type === 'post') {
      return <MessageCircle className="w-6 h-6" />;
    } else {
      return <FileText className="w-6 h-6" />;
    }
  };

  const getAriaLabel = () => {
    if (isLoading) {
      return `Vérification de l'existence du ${type}...`;
    }
    
    if (type === 'post') {
      return associatedId 
        ? 'Aller au chat associé' 
        : 'Aller aux conversations';
    } else {
      return associatedId 
        ? 'Aller au post associé' 
        : 'Aller aux publications';
    }
  };

  const getTooltipText = () => {
    if (type === 'post') {
      return associatedId 
        ? 'Voir le chat' 
        : 'Voir les chats';
    } else {
      return associatedId 
        ? 'Voir le post' 
        : 'Voir les posts';
    }
  };

  // Don't render if the item doesn't exist or if still loading and no data
  if (exists === false || (isLoading && exists === null)) {
    return null;
  }

  return (
    <AnimatePresence>
      {exists && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.3 
          }}
          className="fixed bottom-6 left-6 z-50 group"
        >
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {getTooltipText()}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>

          {/* FAB Button */}
          <motion.button
            onClick={handleClick}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-14 h-14 rounded-full shadow-lg flex items-center justify-center
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#7C3AED] hover:bg-[#6D28D9] hover:shadow-xl active:shadow-md'
              }
              text-white
            `}
            aria-label={getAriaLabel()}
            title={getTooltipText()}
          >
            {getIcon()}
          </motion.button>

          {/* Ripple effect on click */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-0"
            animate={{ scale: [0, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 0.4 }}
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionButton;