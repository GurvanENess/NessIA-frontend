import { motion } from "framer-motion";
import { Filter, MessageCircle, Search } from "lucide-react";
import React from "react";
import { ChatsState } from "../entities/ChatTypes";

interface ChatsHeaderProps {
  totalChats: number;
  sortBy: ChatsState["sortBy"];
  sortOrder: ChatsState["sortOrder"];
  onSortChange: (
    sortBy: ChatsState["sortBy"],
    sortOrder: ChatsState["sortOrder"]
  ) => void;
  onCreateNew: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatsHeader: React.FC<ChatsHeaderProps> = ({
  totalChats,
  sortBy,
  sortOrder,
  onSortChange,
  onCreateNew,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
    >
      {/* Title and Create Button */}
      <div className="flex flex-col items-center xs:items-center xs:flex-row xs:justify-between mb-6">
        <div className="mb-4 xs:mt-0">
          <h1 className="text-2xl font-coolvetica text-gray-900 xs:mb-1">
            Conversations
          </h1>
          <p className="text-sm text-gray-600">
            {totalChats} conversation{totalChats !== 1 ? "s" : ""} au total
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          className="bg-[#7C3AED] w-full xs:w-auto flex justify-center text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#6D28D9] transition-colors flex items-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Nouvelle conversation
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans vos conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors text-sm"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-") as [
                ChatsState["sortBy"],
                ChatsState["sortOrder"]
              ];
              onSortChange(newSortBy, newSortOrder);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
          >
            <option value="date-desc">Plus récent</option>
            <option value="date-asc">Plus ancien</option>
            <option value="title-asc">Titre A-Z</option>
            <option value="title-desc">Titre Z-A</option>
            <option value="activity-desc">Plus actif</option>
            <option value="activity-asc">Moins actif</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatsHeader;
