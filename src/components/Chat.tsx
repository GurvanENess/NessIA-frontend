import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, Bot } from 'lucide-react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
}

const aiResponses = [
  "Je comprends parfaitement votre question. Laissez-moi vous expliquer en détail. La réponse implique plusieurs aspects importants qu'il faut considérer. Premièrement, il est essentiel de noter que ce sujet est complexe et nécessite une analyse approfondie. En prenant en compte les différents facteurs, nous pouvons arriver à une compréhension plus complète de la situation.",
  "D'accord, je vois.",
  "Voici une réponse concise à votre question.",
  "Intéressant ! Cette question soulève plusieurs points importants. Permettez-moi de les aborder un par un.",
  "Je peux vous aider avec ça. La solution est simple et directe.",
  "Excellente question ! C'est un sujet fascinant qui mérite une exploration approfondie. En effet, de nombreuses recherches ont été menées dans ce domaine, et les résultats sont particulièrement intéressants. Laissez-moi vous expliquer les principales découvertes et leurs implications pratiques."
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      isAi: true,
      content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setIsLoading(true);
    const randomDelay = Math.floor(Math.random() * 1000) + 500;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      isAi: false,
      content: messageInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiResponse: Message = {
        id: `msg-${Date.now()}-ai`,
        isAi: true,
        content: randomResponse,
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 300);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Messages */}
      <div className="flex-1 pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col space-y-6 py-6" ref={messagesContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg shadow-sm p-4 message-animation ${
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
            <div ref={messageEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 pb-6 px-4">
        <form onSubmit={handleSendMessage} className="md:max-w-2xl md:mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 md:mx-auto md:w-[600px]">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="w-full pl-4 pr-32 py-4 rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 md:text-base"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#7C3AED] text-white p-2 rounded-full hover:bg-[#6D28D9] transition-colors shadow-sm"
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
    </>
  );
};

export default Chat;