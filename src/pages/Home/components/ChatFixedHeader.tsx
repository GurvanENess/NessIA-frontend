import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Share, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatFixedHeaderProps {
  chatId: string;
  chatTitle: string;
  onRenameChat: () => void;
  onDeleteChat: () => void;
}

const ChatFixedHeader: React.FC<ChatFixedHeaderProps> = ({
  chatId,
  chatTitle,
  onRenameChat,
  onDeleteChat,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-[#E7E9F2]/90 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Chat Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {truncateTitle(chatTitle)}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Partager"
          >
            <Share className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              title="Plus d'options"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]"
                >
                  <button
                    onClick={handleRename}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Renommer
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Blur gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-[#E7E9F2]/20 to-transparent pointer-events-none" />
    </div>

      {/* Blur gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default ChatFixedHeader;