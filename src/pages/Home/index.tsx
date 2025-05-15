import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useVirtual } from 'react-virtual';
import { format } from 'date-fns';
import { MessageSquare, ThumbsUp, Share2, Users, Bell, Hash } from 'lucide-react';
import MessageInput from '../../components/chat/MessageInput';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { state } = useChat();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: state.messages.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
    overscan: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      {/* Main chat area */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Community Chat</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Créer un post
          </button>
        </div>

        {/* Messages area */}
        <div
          ref={parentRef}
          className="flex-1 overflow-auto p-4"
          style={{ height: 'calc(100vh - 300px)' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow) => {
              const message = state.messages[virtualRow.index];
              return (
                <div
                  key={message.id}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.sender.name}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(message.timestamp), 'PPp')}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-900">{message.content}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Like</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                            <MessageSquare className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message input */}
        <MessageInput />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-80 ml-8">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Members
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={`https://i.pravatar.cc/32?img=${i}`}
                  alt={`User ${i}`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">User {i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Popular Topics
          </h2>
          <div className="space-y-2">
            {['General', 'Announcements', 'Questions'].map((topic) => (
              <button
                key={topic}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                <p>New message in #general</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;