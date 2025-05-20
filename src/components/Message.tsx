import React, { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { MessageProps } from "../types/message";

const Message: React.FC<MessageProps> = ({
  isAi,
  content,
  timestamp,
  showActions,
  onValidate,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (showActions) {
      setShouldRender(true);
      // Small delay to ensure the element is rendered before starting the transition
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      // Wait for the transition to complete before removing from DOM
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showActions]);

  const handleValidateClick = () => {
    setIsVisible(false);
    if (onValidate) {
      onValidate();
    }
  };

  const handleCancelClick = () => {
    setIsVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div>
      <div
        className={`rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] p-4 message-animation ${
          isAi ? "bg-white" : "bg-[#7C3AED] text-white ml-12"
        }`}
      >
        <div className="flex items-start space-x-3">
          {isAi && (
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/nessia_logo.svg"
                  alt="NessIA"
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium font-coolvetica tracking-wider">
                {isAi ? "NessIA" : "Vous"}
              </h3>
              <span
                className={`text-sm italic ${
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
      {shouldRender && (
        <div
          className={`flex space-x-2 mt-3 ml-[52px] transition-all duration-300 ease-in-out ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-4"
          }`}
        >
          <button
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors shadow-sm text-sm font-medium"
            onClick={handleValidateClick}
          >
            Valider
          </button>
          <button
            className="px-4 py-2 bg-white text-[#1A201B] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
            onClick={handleCancelClick}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
