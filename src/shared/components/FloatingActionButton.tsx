import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageCircle, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistence = async () => {
      setIsLoading(true);
      try {
        // Check if both the current item AND its counterpart exist
        if (type === 'post') {
          // On post page, check if both post and corresponding chat exist
          const [post, chat] = await Promise.all([
            db.getPostById(id),
            ChatsService.fetchChatById(id)
          ]);
          setExists(!!post && !!chat);
        } else if (type === 'chat') {
          // On chat page, check if both chat and corresponding post exist
          const [chat, post] = await Promise.all([
            ChatsService.fetchChatById(id),
            db.getPostById(id)
          ]);
          setExists(!!chat && !!post);
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
    if (type === 'post') {
      // From post page, navigate to corresponding chat
      navigate(`/chats/${id}`);
    } else if (type === 'chat') {
      // From chat page, navigate to corresponding post
      navigate(`/posts/${id}`);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-6 h-6 animate-spin" />;
    }
    return type === 'post' ? 
      <FileText className="w-6 h-6" /> : 
      <MessageCircle className="w-6 h-6" />;
  };

  const getAriaLabel = () => {
    return type === 'post' ? 
      `Aller au chat ${id}` : 
      `Aller au post ${id}`;
  };

  const getTooltipText = () => {
    return type === 'post' ? 
      'Voir la conversation' : 
      'Voir le post';
  };

  // Don't render if loading or doesn't exist
  if (isLoading || !exists) {
    return null;
  }

  return (
    <AnimatePresence>
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
        className="fixed bottom-6 left-6 z-40 group"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {getTooltipText()}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>

        {/* FAB Button */}
        <motion.button
          onClick={handleClick}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center
            transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2
            ${type === 'post' 
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white' 
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] focus:ring-purple-500 text-white'
            }
            ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
            hover:shadow-xl active:shadow-md
          `}
          aria-label={getAriaLabel()}
          title={getTooltipText()}
        >
          {getIcon()}
        </motion.button>

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={false}
          whileTap={{
            scale: [1, 1.3],
            opacity: [0.3, 0],
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: type === 'post' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingActionButton;