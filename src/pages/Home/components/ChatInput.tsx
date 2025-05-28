import React, { useRef, useEffect } from "react";
import { Send, Image } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (e: React.FormEvent | React.KeyboardEvent) => void;
  isLoading: boolean;
  error: string | null;
  children?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  error,
  children,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        onChange(value + "\n");
      } else {
        e.preventDefault();
        onSend(e);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:pb-8">
      <form onSubmit={onSend} className="sm:max-w-full md:max-w-2xl mx-auto">
        <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">{children}</div>
        {error && <p className="text-sm text-red-600 px-4 mb-2">{error}</p>}
        {isLoading && (
          <p className="text-sm text-gray-500 px-4 mb-2">NessIA rédige...</p>
        )}
        <div className="relative w-full md:mx-auto bg-white md:rounded-2xl border border-gray-300 transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Discuter avec NessIA"
            rows={1}
            disabled={isLoading}
            className="resize-none w-full px-4 pt-4 pb-2 rounded-2xl bg-transparent focus:outline-none max-h-[200px] overflow-y-auto whitespace-pre-wrap"
            style={{ minHeight: "56px" }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <button
              type="button"
              className="hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <Image className="w-7 h-7 text-[#1A201B]" />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#7C3AED] text-white p-[5px] rounded-md hover:bg-[#6D28D9] transition-colors shadow-sm"
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
  );
};

export default ChatInput;
