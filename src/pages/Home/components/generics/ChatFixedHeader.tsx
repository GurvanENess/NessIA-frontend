import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../shared/contexts/AppContext";

interface ChatFixedHeaderProps {
  chatId: string;
  chatTitle: string;
  associatedPostId?: string;
  onRenameChat: () => void;
  onDeleteChat: () => void;
  onToggleSidebar?: () => void;
}

const ChatFixedHeader: React.FC<ChatFixedHeaderProps> = ({
  chatId,
  chatTitle,
  associatedPostId,
  onRenameChat,
  onDeleteChat,
  onToggleSidebar,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useApp();
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
      dispatch({ type: "OPEN_POST_PANEL", payload: associatedPostId });
      navigate(`/chats/${chatId}/post/`);
      setShowDropdown(false);
    }
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <div className="block xl:hidden sticky top-0 left-0 right-0 z-20 bg-[#E7E9F2] border-b border-[rgba(0,0,0,0.4)] py-[8px] pb-[7px]">
      <div className="px-4 flex items-center justify-between w-full">
        <div className="h-12 flex items-center justify-between w-full">
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            title="Ouvrir le menu"
          >
            <img
              src="/assets/align-center.svg"
              alt="Menu"
              className="w-12 h-12"
            />
          </button>
          {/* Chat Title - Clickable with dropdown */}
          <div className="flex-1 md:flex-none" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex justify-center relative items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors cursor-pointer group w-full md:w-auto"
              title="Cliquer pour les options"
            >
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-6 transform mt-2 bg-white rounded-xl shadow-lg border border-gray-300 z-50 min-w-[180px] py-2"
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
              <h1 className="font-medium truncate max-w-[200px] md:max-w-[300px] text-sm md:text-base">
                {truncateTitle(chatTitle)}
              </h1>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Actions - View Post button instead of Share */}
          <div className="flex items-center gap-2 ml-2 md:ml-4">
            {/* View Post Button - Only show if there's an associated post */}
            {associatedPostId && (
              <button
                onClick={handleViewPost}
                className="relative xl:hidden z-10 flex items-center mt-1 gap-1 md:gap-2 bg-[#7C3AED] text-white px-2 md:px-3 py-2 rounded-lg hover:bg-[#6D28D9] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-xs md:text-sm"
                title="Voir le post associé"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Voir le post</span>
                <span className="md:hidden">Post</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFixedHeader;
