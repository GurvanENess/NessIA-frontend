import React, { useEffect } from "react";
import InstagramPost from "../../../../shared/components/InstagramPost";
import { Post } from "../../../Posts/entities/PostTypes";
import { useApp } from "../../../../shared/contexts/AppContext";

interface PreviewTabProps {
  post: Post;
  onEdit: () => void;
  onSchedule: () => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  post,
  onEdit,
  onSchedule,
}) => {
  useEffect(() => {});
  const isPublished = post.status === "published";
  const { state } = useApp();
  const platforms = state.currentCompany?.platforms ?? [];
  const accountName =
    platforms.find((p) => p.platform_name === post.platform)?.account_name ||
    "nessia";

  return (
    <div className="flex flex-col items-center" id="preview-tab">
      <InstagramPost
        images={post.images && post.images.length > 0 ? post.images : []}
        caption={post.description}
        hashtags={(post.hashtags || []).join(" ")}
        username={accountName}
        className="max-w-[400px]"
      />
      {isPublished && (
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <span className="font-medium">✓ Ce post a été publié</span>
        </div>
      )}
      {/* TODO: Boutons d'edition et programmation disponibles avec les onglets en haut. Choisir l'un ou l'autre */}
      {/* <div className="flex gap-3 mt-4">
        <button
          onClick={onEdit}
          disabled={isPublished}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPublished
              ? "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          title={isPublished ? "Indisponible pour un post déjà publié" : ""}
        >
          Modifier
        </button>
        <button
          onClick={onSchedule}
          disabled={isPublished}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPublished
              ? "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50"
              : "text-blue-700 hover:bg-blue-50"
          }`}
          title={isPublished ? "Indisponible pour un post déjà publié" : ""}
        >
          Programmer
        </button>
      </div> */}
    </div>
  );
};

export default PreviewTab;
