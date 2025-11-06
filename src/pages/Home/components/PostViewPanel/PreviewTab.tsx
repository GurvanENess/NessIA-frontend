import React, { useMemo } from "react";
import PostPreview from "../../../../shared/components/PostPreviews/PostPreview";
import GenericPostPreview from "../../../../shared/components/PostPreviews/GenericPostPreview";
import { useApp } from "../../../../shared/contexts/AppContext";
import { Post } from "../../../Posts/entities/PostTypes";

interface PreviewTabProps {
  post: Post;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ post }) => {
  const isPublished = post.status === "published";
  const { state } = useApp();
  const accountName = useMemo(() => {
    const connectedPlatforms = state.currentCompany?.platforms ?? [];

    return (
      connectedPlatforms.find(
        (platform) =>
          platform.platform_name?.toLowerCase() === post.platform
      )?.account_name || "nessia"
    );
  }, [state.currentCompany?.platforms, post.platform]);

  return (
    <div className="flex flex-col items-center" id="preview-tab">
      <PostPreview
        post={post}
        accountName={accountName}
        fallback={GenericPostPreview}
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
