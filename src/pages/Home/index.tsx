import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Send,
  Image,
  Smile,
  AtSign,
  BellDot,
  Settings,
  Users,
  Hash,
  Plus,
  Search
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  attachments?: string[];
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    user: {
      name: 'Sophie Martin',
      avatar: 'https://i.pravatar.cc/40?img=1',
      status: 'online'
    },
    content: "Je viens de terminer la présentation pour le projet client. N'hésitez pas à me faire vos retours !",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 12,
    comments: 5,
    shares: 2,
    attachments: ['presentation.pdf']
  },
  {
    id: 'msg-2',
    user: {
      name: 'Thomas Bernard',
      avatar: 'https://i.pravatar.cc/40?img=2',
      status: 'offline'
    },
    content: "Super travail ! J'ai quelques suggestions pour la section analytics.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    likes: 8,
    comments: 3,
    shares: 0
  }
];

const MOCK_MEMBERS = [
  { id: '1', name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/32?img=1', status: 'online' },
  { id: '2', name: 'Thomas Bernard', avatar: 'https://i.pravatar.cc/32?img=2', status: 'offline' },
  { id: '3', name: 'Julie Dubois', avatar: 'https://i.pravatar.cc/32?img=3', status: 'online' }
];

const MOCK_CHANNELS = [
  { id: '1', name: 'Général', unread: 3 },
  { id: '2', name: 'Annonces', unread: 0 },
  { id: '3', name: 'Projets', unread: 5 },
  { id: '4', name: 'Ressources', unread: 0 },
  { id: '5', name: 'Off-topic', unread: 2 }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(MOCK_CHANNELS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMoreMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newMessages = Array.from({ length: 10 }, (_, i) => ({
        id: `msg-${messages.length + i}`,
        user: {
          name: `User ${messages.length + i + 1}`,
          avatar: `https://i.pravatar.cc/40?img=${(messages.length + i) % 70}`,
          status: i % 2 === 0 ? 'online' : 'offline'
        },
        content: `This is an older message ${messages.length + i + 1}.`,
        timestamp: new Date(Date.now() - (messages.length + i) * 1000 * 60 * 60),
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        shares: Math.floor(Math.random() * 10),
      }));
      setMessages(prev => [...prev, ...newMessages]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleDraftSave = () => {
    localStorage.setItem('messageDraft', messageInput);
    setIsDrafting(true);
    setTimeout(() => setIsDrafting(false), 2000);
  };

  useEffect(() => {
    if (inView && !isLoading) {
      loadMoreMessages();
    }
  }, [inView]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('messageDraft');
    if (savedDraft) {
      setMessageInput(savedDraft);
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      user: {
        name: user?.name || 'Anonymous',
        avatar: `https://i.pravatar.cc/40?img=1`,
        status: 'online'
      },
      content: messageInput,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setMessages(prev => [newMessage, ...prev]);
    setMessageInput('');
    localStorage.removeItem('messageDraft');
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left Sidebar - Channels */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <img src="/assets/nessia_logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-semibold text-gray-900">Nessia Chat</span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent border-none focus:outline-none text-sm flex-1"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Canaux
            </h3>
            <div className="space-y-1">
              {MOCK_CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${
                    selectedChannel.id === channel.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Membres
            </h3>
            <div className="space-y-1">
              {MOCK_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Channel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              # {selectedChannel.name}
            </h2>
            <span className="text-sm text-gray-500">
              {MOCK_MEMBERS.length} membres
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Users className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BellDot className="w-5 h-5" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Créer un post</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      message.user.status === 'online'
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {message.user.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(message.timestamp, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{message.content}</p>
                  {message.attachments && (
                    <div className="mt-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700"
                        >
                          <Image className="w-4 h-4" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-600 text-sm flex items-center space-x-1">
                      <span>👍</span>
                      <span>{message.likes}</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 text-sm flex items-center space-x-1">
                      <span>💬</span>
                      <span>{message.comments}</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 text-sm flex items-center space-x-1">
                      <span>↗️</span>
                      <span>{message.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={ref} />
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <AtSign className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDraftSave}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                {isDrafting ? 'Brouillon sauvegardé !' : 'Sauvegarder comme brouillon'}
              </button>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Prévisualiser
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Envoyer</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              // Handle file upload
              console.log(e.target.files);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;