import { Globe2, ImageIcon } from "lucide-react";
import React, { useMemo } from "react";
import InstagramPost from "../../../../shared/components/InstagramPost";
import { useApp } from "../../../../shared/contexts/AppContext";
import { getPlatformText } from "../../../../shared/utils/postUtils";
import { Post } from "../../../Posts/entities/PostTypes";
import FacebookPostPreview from "./FacebookPostPreview";

interface PreviewTabProps {
  post: Post;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ post }) => {
  const isPublished = post.status === "published";
  const { state } = useApp();
  const accountName = useMemo(() => {
    const connectedPlatforms = state.currentCompany?.platforms ?? [];

    const byId = connectedPlatforms.find(
      (platform) => platform.platform_id === post.platformId
    )?.account_name;

    if (byId) {
      return byId;
    }

    return (
      connectedPlatforms.find(
        (platform) =>
          platform.platform_name?.toLowerCase() === post.platform
      )?.account_name || "nessia"
    );
  }, [state.currentCompany?.platforms, post.platformId, post.platform]);

  const renderGenericPreview = () => {
    const icon = <Globe2 className="h-5 w-5 text-gray-500" />;
    const platformLabel = getPlatformText(post.platform);
    const hasImages = (post.images?.length ?? 0) > 0;

    return (
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
          {icon}
          <div>
            <p className="text-sm font-semibold text-gray-900">{accountName}</p>
            <p className="text-xs text-gray-500">{platformLabel}</p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          {hasImages ? (
            <div className="grid gap-2">
              {post.images?.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg border border-gray-100"
                >
                  <img
                    src={image.url}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-gray-500">
              <ImageIcon className="mr-2 h-5 w-5" />
              Aucun média attaché
            </div>
          )}
          <p className="whitespace-pre-wrap text-sm text-gray-800">
            {post.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center" id="preview-tab">
      {post.platform === "instagram" ? (
        <InstagramPost
          images={post.images && post.images.length > 0 ? post.images : []}
          caption={post.description}
          hashtags={(post.hashtags || []).join(" ")}
          username={accountName}
          platform={post.platform}
          platformId={post.platformId ?? null}
          className="max-w-[400px]"
        />
      ) : post.platform === "facebook" ? (
        <FacebookPostPreview accountName={accountName} post={post} />
      ) : (
        renderGenericPreview()
      )}
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
