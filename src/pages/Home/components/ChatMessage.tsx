import React from "react";
import { Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Message as MessageType } from "../../../types/ChatTypes";
import { Action } from "../../../types/mockAITypes";
import { mockAiClient } from "../../../api/mockAi";

const Message: React.FC<MessageType> = ({
  id,
  isAi,
  content,
  timestamp,
  showActions,
  actions = [],
  handleAction,
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
              <img
                src="./assets/nessia_logo.svg"
                alt="nessia logo"
                className="invert brightness-0 w-7" // Ajout des classes pour rendre l'image blanche
              />
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
      {isAi && actions.length > 0 && (
        <div
          className={`flex flex-wrap gap-2 mt-3 ml-[52px] transition-all duration-500 ease-in-out transform ${
            showActions
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium ${
                action.type === "primary"
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                  : "bg-white text-[#1A201B] border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => {
                handleAction && handleAction(action);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
