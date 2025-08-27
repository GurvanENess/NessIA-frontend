import { motion } from "framer-motion";
import { Filter, Plus, Search } from "lucide-react";
import React from "react";
import { PostsState } from "../entities/PostTypes";

interface PostsHeaderProps {
  totalPosts: number;
  sortBy: PostsState["sortBy"];
  sortOrder: PostsState["sortOrder"];
  onSortChange: (
    sortBy: PostsState["sortBy"],
    sortOrder: PostsState["sortOrder"]
  ) => void;
  onCreateNew: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const PostsHeader: React.FC<PostsHeaderProps> = ({
  totalPosts,
  sortBy,
  sortOrder,
  onSortChange,
  onCreateNew,
  searchQuery,
  onSearchChange,
}) => {
  const handleSortChange = (newSortBy: PostsState["sortBy"]) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    onSortChange(newSortBy, newSortOrder);
  };

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
          <h1 className="text-2xl font-coolvetica text-gray-900 mb-1">
            Publications
          </h1>
          <p className="text-sm text-gray-600">
            {totalPosts} publication{totalPosts !== 1 ? "s" : ""} au total
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          className="bg-[#7C3AED] w-full xs:w-auto flex justify-center text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#6D28D9] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau post
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans vos publications..."
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
                PostsState["sortBy"],
                PostsState["sortOrder"]
              ];
              onSortChange(newSortBy, newSortOrder);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
          >
            <option value="date-desc">Plus récent</option>
            <option value="date-asc">Plus ancien</option>
            <option value="status-asc">Statut A-Z</option>
            <option value="status-desc">Statut Z-A</option>
            <option value="platform-asc">Plateforme A-Z</option>
            <option value="platform-desc">Plateforme Z-A</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default PostsHeader;
