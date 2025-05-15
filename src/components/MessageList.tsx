import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { RootState } from '../store';
import ReactMarkdown from 'react-markdown';

const MessageList: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      // Load more messages when user scrolls up
      // Implementation depends on your API
    }
  }, [inView]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
    >
      {/* Intersection observer target for infinite scroll */}
      <div ref={ref} className="h-1" />

      {messages.map((message) => (
        <div key={message.id} className="flex space-x-4">
          <img
            src={message.avatar}
            alt={message.username}
            className="w-10 h-10 rounded-full"
            loading="lazy"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{message.username}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </span>
            </div>

            <div className="mt-2 prose prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {message.attachments?.map((attachment, index) => (
              <div key={index} className="mt-2">
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.url}
                    alt="Attachment"
                    className="max-w-md rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <a href={attachment.url} className="text-blue-600 hover:underline">
                      View attachment
                    </a>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4 flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                <Heart className="w-4 h-4" />
                <span>{Object.values(message.reactions).flat().length}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                <MessageSquare className="w-4 h-4" />
                <span>Reply</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};