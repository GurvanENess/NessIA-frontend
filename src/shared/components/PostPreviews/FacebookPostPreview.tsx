import React, { useMemo } from "react";
import { PostPreviewProps } from "./types";

const MAX_VISIBLE_IMAGES = 4; // 1 grande image + 3 petites en dessous

/**
 * Composant de preview pour les posts Facebook
 */
const FacebookPostPreview: React.FC<PostPreviewProps> = ({
  post,
  accountName,
  className,
}) => {
  const { images = [] } = post;

  const { visibleImages, remainingCount } = useMemo(() => {
    const limited = images.slice(0, MAX_VISIBLE_IMAGES);
    return {
      visibleImages: limited,
      remainingCount: Math.max(images.length - limited.length, 0),
    };
  }, [images]);

  const initials = useMemo(() => {
    const parts = accountName.trim().split(" ");
    if (parts.length === 0) {
      return "";
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [accountName]);

  const renderMediaGrid = () => {
    if (visibleImages.length === 0) {
      return (
        <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
          Aucun média attaché
        </div>
      );
    }

    const count = visibleImages.length;

    // 1 image : prend toute la place
    if (count === 1) {
      return (
        <div className="relative w-full overflow-hidden rounded-md bg-gray-100">
          <img
            src={visibleImages[0].url}
            alt={post.title || `Image 1`}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      );
    }

    // 2 images : deux carrés côte à côte
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {visibleImages.map((image, index) => (
            <div
              key={image.id ?? index}
              className="relative aspect-square overflow-hidden rounded-md bg-gray-100"
            >
              <img
                src={image.url}
                alt={post.title || `Image ${index + 1}`}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      );
    }

    // 3+ images : grande image au dessus, images en dessous
    // - 3 images : 1 image en haut + grid-cols-2 pour les 2 images restantes
    // - 4+ images : 1 image en haut + grid-cols-3 pour les images restantes
    if (count >= 3) {
      const topImage = visibleImages[0];
      const bottomImages = visibleImages.slice(1, 4); // Max 3 images en dessous
      const gridCols = count === 3 ? "grid-cols-2" : "grid-cols-3";

      return (
        <div className="space-y-1">
          {/* Grande image au dessus */}
          <div className="relative w-full overflow-hidden rounded-md bg-gray-100">
            <img
              src={topImage.url}
              alt={post.title || `Image 1`}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>

          {/* Images en dessous */}
          {bottomImages.length > 0 && (
            <div className={`grid ${gridCols} gap-1`}>
              {bottomImages.map((image, index) => {
                const actualIndex = index + 1; // Index dans visibleImages
                const isLastVisible = actualIndex === visibleImages.length - 1;
                const shouldShowBadge = remainingCount > 0 && isLastVisible;

                return (
                  <div
                    key={image.id ?? actualIndex}
                    className="relative aspect-square overflow-hidden rounded-md bg-gray-100"
                  >
                    <img
                      src={image.url}
                      alt={post.title || `Image ${actualIndex + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {shouldShowBadge && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-semibold text-white">
                        +{remainingCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    const textSections = [post.description, (post.hashtags || []).join(" ")]
      .filter(Boolean)
      .join("\n\n")
      .trim();

    if (!textSections) {
      return null;
    }

    return (
      <p className="whitespace-pre-line text-sm text-gray-900">{textSections}</p>
    );
  };

  return (
    <div
      className={`w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-semibold uppercase text-white">
          {initials || accountName[0] || "?"}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-semibold leading-tight text-gray-900">
            {accountName}
          </span>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <span>À l'instant</span>
            <span>•</span>
            <span>Public</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-1 w-1 rounded-full bg-gray-400" />
          <div className="h-1 w-1 rounded-full bg-gray-400" />
          <div className="h-1 w-1 rounded-full bg-gray-400" />
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        {renderContent()}
        <div className="overflow-hidden rounded-lg">
          {renderMediaGrid()}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <span role="img" aria-label="like" className="text-base">
            👍
          </span>
          122
        </span>
        <div className="flex items-center gap-4">
          <span>34 commentaires</span>
          <span>12 partages</span>
        </div>
      </div>
    </div>
  );
};

export default FacebookPostPreview;

