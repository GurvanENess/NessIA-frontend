import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import React from "react";
import Markdown from "react-markdown";
import { Message as MessageType } from "../../../../shared/entities/ChatTypes";
import markdownConfig from "../../../../shared/utils/markdownConfig";

const Message: React.FC<MessageType> = ({
  isAi,
  content,
  timestamp,
  postData,
}) => {
  return (
    <div>
      <div
        className={`rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] shadow-sm p-4 message-animation ${
          isAi
            ? "bg-white border border-gray-300"
            : "bg-[#7C3AED] text-white ml-12"
        }`}
      >
        <div className="flex items-start space-x-3">
          {isAi && (
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center">
              <img
                src="/assets/nessia_logo.svg"
                alt="nessia logo"
                className="invert brightness-0 w-7"
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
            <div className={`mt-2 ${isAi ? "text-gray-700" : "text-white/90"}`}>
              {isAi ? (
                <Markdown {...markdownConfig}>{content}</Markdown>
              ) : (
                content
              )}
            </div>
          </div>
        </div>
      </div>

      {
        // postData && (
        // <div className="pt-5 pb-3 scale-100">
        /* InstagramPost {...postData} /> */
        // </div>
        // )
      }
    </div>
  );
};

export default Message;
