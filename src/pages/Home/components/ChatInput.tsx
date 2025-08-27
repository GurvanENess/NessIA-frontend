import { Image, Send } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Job } from "../../../shared/entities/JobTypes";
import JobStatus from "./JobStatus";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (messageToSend: string, hideUserMessage: boolean) => void;
  handleSuggestionClick: (job: unknown, answer: string) => Promise<void>;
  isLoading: boolean;
  jobs?: Job[];
  children?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  handleSuggestionClick,
  isLoading,
  children,
  jobs = [],
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
        onSend(value, false);
      }
    }
  };

  const hasActiveJobs = jobs.some(
    (job) => job.status === "running" || job.status === "waiting_user"
  );

  return (
    <>
      {/* Affichage du statut des jobs */}
      <JobStatus jobs={jobs} onSuggestionClick={handleSuggestionClick} />

      <div className="sticky bottom-0 left-0 right-0 md:pb-8 md:px-2  ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(value, false);
          }}
          className="sm:max-w-full md:max-w-2xl mx-auto"
        >
          <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
            {children}
          </div>

          <div className="shadow relative w-full md:mx-auto bg-white md:rounded-2xl border border-gray-300 transition-colors">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasActiveJobs
                  ? "Répondez à NessIA ou attendez la fin du traitement..."
                  : "Discuter avec NessIA"
              }
              rows={1}
              disabled={isLoading || hasActiveJobs}
              className="resize-none w-full px-4 pt-4 pb-2 rounded-2xl bg-transparent focus:outline-none max-h-[200px] overflow-y-auto whitespace-pre-wrap disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: "56px" }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button
                type="button"
                disabled={isLoading || hasActiveJobs}
                className="hover:bg-gray-50 rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image className="w-7 h-7 text-[#1A201B]" />
              </button>
              <button
                type="submit"
                disabled={isLoading || hasActiveJobs || !value.trim()}
                className="bg-[#7C3AED] text-white p-[5px] rounded-md hover:bg-[#6D28D9] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7C3AED]"
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

export default ChatInput;
