import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatFixedHeaderProps {
  chatId: string;
  chatTitle: string;
  associatedPostId?: string;
  onRenameChat: () => void;
  onDeleteChat: () => void;
}

const ChatFixedHeader: React.FC<ChatFixedHeaderProps> = ({
  chatId,
  chatTitle,
  associatedPostId,
  onRenameChat,
  onDeleteChat,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share chat:", chatId);
    setShowDropdown(false);
  };

  const handleRename = () => {
    onRenameChat();
    setShowDropdown(false);
  };

  const handleDelete = () => {
    onDeleteChat();
    setShowDropdown(false);
  };

  const handleViewPost = () => {
    if (associatedPostId) {
      navigate(`/posts/${associatedPostId}`);
      setShowDropdown(false);
    }
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-30 bg-[#E7E9F2]">
      <div className="px-4 flex items-center justify-between w-full">
        <div className="px-4 h-12 flex items-center justify-between w-full">
          {/* Chat Title - Clickable with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors cursor-pointer group"
              title="Cliquer pour les options"
            >
              <h1 className="font-medium truncate max-w-[300px]">
                {truncateTitle(chatTitle)}
              </h1>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-[90%] mt-2 bg-white rounded-xl shadow-lg border border-gray-300 z-50 min-w-[180px] py-2"
                >
                  <button
                    onClick={handleRename}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    Renommer
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    Supprimer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions - View Post button instead of Share */}
          <div className="flex items-center gap-2 ml-4">
            {/* View Post Button - Only show if there's an associated post */}
            {associatedPostId && (
              <button
                onClick={handleViewPost}
                className="relative z-10 flex items-center gap-2 bg-[#7C3AED] text-white px-3 py-2 rounded-lg hover:bg-[#6D28D9] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm"
                title="Voir le post associé"
              >
                <Eye className="w-4 h-4" />
                <span>Voir le post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Blur gradient at bottom */}
      <div className="absolute bottom-[5px] left-0 right-0 shadow-[0px_5px_5px_8px_#e7e9f2] h-[1px] pointer-events-none" />
    </div>
  );
};

export default ChatFixedHeader;
