import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Send, Paperclip, Smile, Image } from 'lucide-react';
import { addMessage } from '../../store/chatSlice';

const MessageInput: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !isUploading) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: '1', // Replace with actual user ID
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/40?img=1',
      },
      timestamp: new Date().toISOString(),
      reactions: [],
    };

    dispatch(addMessage(newMessage));
    setMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    // Implement file upload logic here
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-gray-50 rounded-lg p-2">
          <div className="flex items-center space-x-2 mb-2">
            <button
              type="button"
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[60px] max-h-[200px] bg-transparent border-0 focus:ring-0 resize-none"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() && !isUploading}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        multiple
      />
    </form>
  );
};