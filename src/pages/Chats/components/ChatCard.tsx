import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, MoreVertical, Eye, Archive, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { ChatConversation } from '../entities/ChatTypes';

interface ChatCardProps {
  chat: ChatConversation;
  onViewChat?: (chatId: string) => void;
  onViewPost?: (postId: string) => void;
  onArchive?: (chatId: string) => void;
  onDelete?: (chatId: string) => void;
  onChatClick?: (chatId: string) => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ 
  chat, 
  onViewChat, 
  onViewPost,
  onArchive,
  onDelete,
  onChatClick
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getActivityColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActivityText = (isActive: boolean) => {
    return isActive ? 'Actif' : 'Archivé';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onChatClick?.(chat.id)}
    >
      {/* Chat Content */}
      <div className="p-4">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {chat.title}
          </h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Actions de la conversation"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewChat?.(chat.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Voir le chat
                </button>
                {chat.associatedPostId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPost?.(chat.associatedPostId!);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir le post
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(chat.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {chat.isActive ? 'Archiver' : 'Désarchiver'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(chat.id);
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

        {/* Last message excerpt */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateText(chat.lastMessage, 150)}
          </p>
        </div>

        {/* Status and message count */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(chat.isActive)}`}>
            {getActivityText(chat.isActive)}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {chat.messageCount} message{chat.messageCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Footer with date and post link */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Dernière activité le {format(chat.lastMessageDate, 'd MMM yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
          
          {chat.associatedPostId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPost?.(chat.associatedPostId!);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition-colors text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Voir le post</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatCard;