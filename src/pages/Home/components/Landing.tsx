import React from "react";
import ChatInput from "./generics/ChatInput";
import QuickActions from "./generics/QuickActions";

interface LandingProps {
  messageInput: string;
  isLoading: boolean;
  showQuickActions: boolean;
  jobs: any[];
  onMessageInputChange: (value: string) => void;
  onSendMessage: (message: string, hideUserMessage?: boolean) => void;
  onSuggestionClick: (job: any, answer: string) => Promise<void>;
  onQuickAction: (text: string) => Promise<void>;
}

const Landing: React.FC<LandingProps> = ({
  messageInput,
  isLoading,
  showQuickActions,
  jobs,
  onMessageInputChange,
  onSendMessage,
  onSuggestionClick,
  onQuickAction,
}) => {
  return (
    <div className="chat-wrapper flex flex-col h-screen overflow-y-auto">
      <div className="flex-wrapper flex-1 flex flex-col h-full">
        <div className="flex-1 pt-20 md:pb-36 pb-28 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="relative w-full">
                <img
                  src="/assets/green_star.svg"
                  alt="Star Background"
                  className="max-w-[150%] w-[150%] top-1/2 left-1/2 overflow-hidden absolute translate-x-[-50%] translate-y-[-50%] opacity-70 transform transition-opacity duration-1000 [filter:hue-rotate(235deg)_saturate(150%)]"
                />
                <div className="absolute inset-0 flex flex-col w-full items-center justify-center text-center p-4 sm:p-6 md:p-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-coolvetica text-black mb-2">
                    Prêt à créer des posts qui captivent ?
                  </h2>
                  <p className="font-coolvetica w-[60%] text-centerleading-5 text-md sm:text-base md:text-lg text-black">
                    Dites-nous ce que vous voulez partager !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChatInput
          value={messageInput}
          onChange={onMessageInputChange}
          onSend={onSendMessage}
          isLoading={isLoading}
          jobs={jobs}
          handleSuggestionClick={onSuggestionClick}
        >
          {showQuickActions && <QuickActions onSelect={onQuickAction} />}
        </ChatInput>
      </div>
    </div>
  );
};

export default Landing;

