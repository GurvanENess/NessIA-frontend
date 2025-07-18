import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/db"; // services de base de données globaux

interface FloatingActionButtonProps {
  type: "post" | "chat";
  id: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  type,
  id,
}) => {
  // state local lié uniquement à l'ui

  const [exists, setExists] = useState<boolean | null>(null); // définit l'existence de l'élément (post ou chat)
  const [isLoading, setIsLoading] = useState(true);
  const [associatedId, setAssociatedId] = useState<string | null>(null); // gare en mémoire l'id associé (post ou chat) pour la navigation
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistence = async () => {
      setIsLoading(true);
      try {
        if (type === "post") {
          // Check if associated chat exists and get his ID
          const post = await db.getPostById(id);
          const associatedChatId = post?.session?.[0]?.id || null;

          if (associatedChatId) {
            setExists(true);
            setAssociatedId(associatedChatId || null);
          } else {
            setExists(false);
          }
        } else if (type === "chat") {
          // Check if chat exists and get associated post ID
          const chat = await db.getChatById(id);
          const associatedPostId = chat.post_id || null;

          if (associatedPostId) {
            setExists(true);
            setAssociatedId(associatedPostId);
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
    if (type === "post" && associatedId) {
      // Navigate from post to its associated chat
      navigate(`/chats/${associatedId}`);
    } else if (type === "chat" && associatedId) {
      // Navigate from chat to its associated post
      navigate(`/posts/${associatedId}`);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-6 h-6 animate-spin" />;
    }

    if (type === "post") {
      return <MessageCircle className="w-6 h-6" />;
    } else {
      return <FileText className="w-6 h-6" />;
    }
  };

  const getAriaLabel = () => {
    if (isLoading) {
      return `Vérification de l'existence du ${type}...`;
    }

    if (type === "post") {
      return "Aller au chat associé";
    } else {
      return "Aller au post associé";
    }
  };

  const getTooltipText = () => {
    if (type === "post") {
      return "Voir le chat";
    } else {
      return "Voir le post";
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
            duration: 0.3,
          }}
          className="fixed bottom-20 z-50 group"
          style={{
            left: "max(1.5rem, calc(50% - 600px + 2.5rem))", // 384px = max-w-3xl (48rem), 1.5rem = left padding
          }}
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
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7C3AED] hover:bg-[#6D28D9] hover:shadow-xl active:shadow-md"
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
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionButton;
