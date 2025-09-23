import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit,
  Eye,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import React from "react";
import NoImage from "../../../../public/assets/no_image.jpg";
import { Post } from "../entities/PostTypes";

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onViewChat?: (chatId: string) => void;
  onPostClick?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  onViewChat,
  onPostClick,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "Publié";
      case "scheduled":
        return "Programmé";
      case "draft":
        return "Brouillon";
      default:
        return status;
    }
  };

  const getPlatformColor = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "facebook":
        return "bg-blue-100 text-blue-800";
      case "tiktok":
        return "bg-black text-white";
      case "twitter":
        return "bg-sky-100 text-sky-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformText = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "tiktok":
        return "TikTok";
      case "twitter":
        return "Twitter";
      default:
        return platform;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onPostClick?.(post.id)}
    >
      {/* Post Image */}

      {post.images && post.images.length > 0 ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.images[0].url}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={NoImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {post.title}
          </h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Actions du post"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(post);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    onViewChat?.(post.conversationId);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Voir le chat
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(post.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Status and Platform badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              post.status
            )}`}
          >
            {getStatusText(post.status)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(
              post.platform
            )}`}
          >
            {getPlatformText(post.platform)}
          </span>
        </div>

        {/* Footer with date and chat info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {post.status === "published" && post.publishedAt
                ? `Publié le ${format(post.publishedAt, "d MMM yyyy", {
                    locale: fr,
                  })}`
                : post.status === "scheduled" && post.scheduledAt
                ? `Programmé le ${format(post.scheduledAt, "d MMM yyyy", {
                    locale: fr,
                  })}`
                : `Créé le ${format(post.createdAt, "d MMM yyyy", {
                    locale: fr,
                  })}`}
            </span>
          </div>
          {post.conversationId && (
            <button
              onClick={(e) => {
                e.stopPropagation();

                onViewChat?.(post.conversationId);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition-colors text-xs"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat associé</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
