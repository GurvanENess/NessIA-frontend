import { FileText, Loader2, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import { db } from "../services/db";

interface HeaderActionButtonProps {
  type: "post" | "chat";
  id: string;
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  type,
  id,
}) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [associatedId, setAssociatedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentCompanyId = useAppStore((s) => s.currentCompany?.id);

  useEffect(() => {
    const checkExistence = async () => {
      setIsLoading(true);
      try {
        if (type === "post") {
          const post = await db.getPostById(
            id,
            currentCompanyId as string
          );
          if (!post) {
            setExists(false);
            return;
          }
          const associatedChatId = post?.session?.id || null;

          if (associatedChatId) {
            setExists(true);
            setAssociatedId(associatedChatId || null);
          } else {
            setExists(false);
          }
        } else if (type === "chat") {
          const chat = await db.getChatById(
            id,
            currentCompanyId as string
          );

          if (!chat) {
            setExists(false);
            return;
          }
          const associatedPostId = chat.post ? chat.post.id : null;

          if (associatedPostId) {
            setExists(true);
            setAssociatedId(associatedPostId);
          } else {
            setExists(false);
          }
        }
      } catch (error) {
        console.error(`Error checking ${type} existence:`, error);
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistence();
  }, [type, id, currentCompanyId]);

  const handleClick = () => {
    if (type === "post" && associatedId) {
      navigate(`/chats/${associatedId}`);
    } else if (type === "chat" && associatedId) {
      navigate(`/posts/${associatedId}`);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }

    if (type === "post") {
      return <MessageCircle className="w-5 h-5" />;
    } else {
      return <FileText className="w-5 h-5" />;
    }
  };

  const getTooltipText = () => {
    if (type === "post") {
      return "Voir le chat";
    } else {
      return "Voir le post";
    }
  };

  // Don't render if the item doesn't exist or if still loading and no data
  if (exists === false || (isLoading && exists === null)) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-purple-300
        ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md hover:shadow-lg transform hover:scale-105"
        }
      `}
      title={getTooltipText()}
      aria-label={getTooltipText()}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-sm font-medium">
          {type === "post" ? "Voir le chat" : "Voir le post"}
        </span>
      </div>
    </button>
  );
};

export default HeaderActionButton;
