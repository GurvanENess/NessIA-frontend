import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Paperclip, Send } from 'lucide-react';
import { RootState } from '../store';
import { setDraft, addMessage } from '../store/slices/chatSlice';
import toast from 'react-hot-toast';

const ChatInput: React.FC = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.chat.draft);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
    maxSize: 5242880, // 5MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!draft.trim() && files.length === 0) return;

    try {
      // Here you would typically upload files and send the message
      // This is a mock implementation
      const newMessage = {
        id: Date.now().toString(),
        content: draft,
        userId: '1',
        username: 'Current User',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=1',
        timestamp: new Date().toISOString(),
        reactions: {},
        attachments: files.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type,
        })),
      };

      dispatch(addMessage(newMessage));
      dispatch(setDraft(''));
      setFiles([]);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          {...getRootProps()}
          className={`min-h-[100px] p-4 rounded-lg border-2 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <input {...getInputProps()} />
          <textarea
            value={draft}
            onChange={(e) => dispatch(setDraft(e.target.value))}
            placeholder="Type your message here..."
            className="w-full resize-none focus:outline-none bg-transparent"
            rows={3}
          />

          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center"
                >
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="w-6 h-6 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-6 h-6 text-gray-600" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-20">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    dispatch(setDraft(draft + emojiData.emoji));
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!draft.trim() && files.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput