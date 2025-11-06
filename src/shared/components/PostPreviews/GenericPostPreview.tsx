import { Globe2, ImageIcon } from "lucide-react";
import React from "react";
import { getPlatformText } from "../../utils/postUtils";
import { PostPreviewProps } from "./types";

/**
 * Composant de preview générique pour les plateformes sans preview personnalisée
 */
const GenericPostPreview: React.FC<PostPreviewProps> = ({
  post,
  accountName,
  className,
}) => {
  const icon = <Globe2 className="h-5 w-5 text-gray-500" />;
  const platformLabel = getPlatformText(post.platform);
  const hasImages = (post.images?.length ?? 0) > 0;

  return (
    <div
      className={`w-full max-w-[400px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className ?? ""}`}
    >
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

export default GenericPostPreview;

