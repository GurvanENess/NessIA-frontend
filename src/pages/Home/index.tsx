import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Image, Smile, Bot } from 'lucide-react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr'; 
import { useCallback } from 'react';

interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: 'welcome',
        isAi: true,
        content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date(),
      }
    ];
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setIsLoading(true);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      isAi: false,
      content: messageInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        isAi: true,
        content: "Je comprends votre message. Permettez-moi d'y réfléchir...",
        timestamp: new Date(),
      };
      setMessages(prev => [aiResponse, ...prev]);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      scrollToBottom();
    }, 1000);

    scrollToBottom();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center px-4 h-16">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-[#7C3AED]" />
            <img src="/assets/nessia_logo.svg" alt="Nessia" className="h-8" />
            <span className="text-xl font-coolvetica text-[#7C3AED]">Nessia</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16 pb-24 flex flex-col">
        <div className="max-w-3xl mx-auto px-4">
          {/* Messages */}
          <div 
            ref={containerRef}
            className="space-y-6 py-6 flex flex-col-reverse overflow-y-auto"
            style={{ height: 'calc(100vh - 9rem)' }}
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? messageEndRef : undefined}
                className={`rounded-lg shadow-sm p-4 ${
                  message.isAi ? 'bg-white' : 'bg-[#7C3AED] text-white ml-12'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.isAi && (
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {message.isAi ? 'Assistant' : 'Vous'}
                      </h3>
                      <span className={`text-sm ${message.isAi ? 'text-gray-500' : 'text-white/80'}`}>
                        {format(message.timestamp, "d MMM 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className={`mt-2 ${message.isAi ? 'text-gray-700' : 'text-white/90'}`}>
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
              placeholder="Posez votre question..."
              disabled={isLoading}
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
                type="submit"
                disabled={isLoading}
                className="bg-[#7C3AED] text-white p-2 rounded-full hover:bg-[#6D28D9] transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;