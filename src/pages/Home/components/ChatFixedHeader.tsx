import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Edit, Share, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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

          {/* Actions - Only Share button now */}
          <div className="flex items-center gap-2 ml-4">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Partager"
            >
              <Share className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Blur gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-[#E7E9F2]/20 to-transparent pointer-events-none" />
      </div>

      {/* Blur gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 shadow-[0px_2px_8px_3px_#e7e9f2] h-2 pointer-events-none" />
    </div>
  );
};

export default ChatFixedHeader;
