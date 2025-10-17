import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import React from "react";
import Markdown from "react-markdown";
import { Message as MessageType } from "../../../../shared/entities/ChatTypes";
import markdownConfig from "../../../../shared/utils/markdownConfig";
import ChatImageMessage from "./ChatImageMessage";

const Message: React.FC<MessageType> = ({
  isAi,
  content,
  timestamp,
  media,
  isLoading: messageLoading,
}) => {
  // Vérifier si le message est vide (seulement des espaces ou vide)
  const isContentEmpty = !content || content.trim().length === 0;
  const hasMedia = media && media.length > 0;

  // Pour les messages utilisateur sans contenu mais avec des médias, affichage simplifié
  if (!isAi && isContentEmpty && hasMedia) {
    return (
      <div>
        {/* Indicateur simplifié pour message utilisateur avec seulement des images */}
        <div className="flex justify-end items-center mb-2 ml-12">
          <span className="text-sm text-gray-500 mr-2">Vous</span>
          <span className="text-xs text-gray-400">
            {format(timestamp, "d MMM 'à' HH:mm", {
              locale: fr,
            })}
          </span>
        </div>

        {/* Affichage des images */}
        <div className="ml-12">
          <ChatImageMessage
            images={media.map((m) => ({
              id: m.id,
              url: m.url,
              alt: `Image du message`,
            }))}
            compact={media.length > 3}
            className=""
            isLoading={messageLoading}
          />
        </div>
      </div>
    );
  }

  // Affichage normal pour tous les autres cas
  return (
    <div>
      <div
        className={`rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] p-4 message-animation ${
          isAi
            ? "bg-white border border-gray-300"
            : "bg-[#7C3AED] text-white ml-12"
        } ${messageLoading ? "opacity-70" : ""}`}
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

            {!isContentEmpty && (
              <div
                className={`mt-2 ${isAi ? "text-gray-700" : "text-white/90"}`}
              >
                {isAi ? (
                  <Markdown {...markdownConfig}>{content}</Markdown>
                ) : (
                  content
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Affichage des images si présentes - en dehors de la bulle */}
      {/* Seulement si ce n'est pas le cas spécial (message utilisateur vide avec images) */}
      {media && media.length > 0 && !(!isAi && isContentEmpty && hasMedia) && (
        <div className={`mt-3 ${isAi ? "ml-13" : "ml-12"}`}>
          <ChatImageMessage
            images={media.map((m) => ({
              id: m.id,
              url: m.url,
              alt: `Image du message`,
            }))}
            compact={media.length > 3}
            className=""
            isLoading={messageLoading}
          />
        </div>
      )}

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
