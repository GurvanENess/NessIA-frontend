import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Send, Image, Smile, AtSign, Eye, Plus, Bell, Menu } from 'lucide-react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  // Simulated messages data
  useEffect(() => {
    const mockMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
      id: `msg-${i}`,
      user: {
        name: `User ${i + 1}`,
        avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
      },
      content: `This is a sample message ${i + 1} with some content that might be interesting.`,
      timestamp: new Date(Date.now() - i * 1000 * 60 * 60),
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10),
    }));
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      user: {
        name: user?.name || 'Anonymous',
        avatar: `https://i.pravatar.cc/40?img=${messages.length + 1}`,
      },
      content: messageInput,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setMessages(prev => [newMessage, ...prev]);
    setMessageInput('');
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/assets/nessia_logo.svg" alt="Nessia" className="h-8" />
            <span className="text-xl font-coolvetica text-[#7C3AED]">Nessia</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-coolvetica hover:bg-[#6D28D9] transition-colors">
              Créer un post
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out z-40 pt-16`}>
        <div className="p-4">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Membres</h2>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <img
                    src={`https://i.pravatar.cc/32?img=${i + 1}`}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">Utilisateur {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Sujets populaires</h2>
            <div className="space-y-2">
              {['Marketing', 'Design', 'Development', 'Business'].map((topic) => (
                <button
                  key={topic}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                >
                  # {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Messages */}
          <div className="space-y-6 py-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 5 ? ref : undefined}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={message.user.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{message.user.name}</h3>
                      <span className="text-sm text-gray-500">
                        {format(message.timestamp, "d MMM 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{message.content}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <MessageSquare className="w-4 h-4" />
                        <span>{message.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>👍</span>
                        <span>{message.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>🔄</span>
                        <span>{message.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto p-4">
          <div className="relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Écrivez votre message..."
              className="w-full pl-4 pr-32 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <AtSign className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="submit"
                className="bg-[#7C3AED] text-white p-2 rounded-full hover:bg-[#6D28D9] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;