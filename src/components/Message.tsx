import React from "react";
import { Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface MessageProps {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
  onValidate?: () => void;
  onCancel?: () => void;
}

const Message: React.FC<MessageProps> = ({
  isAi,
  content,
  timestamp,
  showActions,
  onValidate,
  onCancel,
}) => {
  return (
    <div>
      <div
        className={`rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] p-4 message-animation ${
          isAi ? "bg-white" : "bg-[#7C3AED] text-white ml-12"
        }`}
      >
        <div className="flex items-start space-x-3">
          {isAi && (
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{isAi ? "Assistant" : "Vous"}</h3>
              <span
                className={`text-sm ${
                  isAi ? "text-gray-500" : "text-white/80"
                }`}
              >
                {format(timestamp, "d MMM 'à' HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>
            <p className={`mt-2 ${isAi ? "text-gray-700" : "text-white/90"}`}>
              {content}
            </p>
          </div>
        </div>
      </div>
      {isAi && (
        <div
          className={`flex space-x-2 mt-3 ml-[52px] transition-all duration-500 ease-in-out transform ${
            showActions
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <button
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors shadow-sm text-sm font-medium"
            onClick={onValidate}
          >
            Valider
          </button>
          <button
            className="px-4 py-2 bg-white text-[#1A201B] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
