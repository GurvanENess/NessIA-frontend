import React, { useMemo } from "react";
import { Post } from "../../../Posts/entities/PostTypes";

interface FacebookPostPreviewProps {
  accountName: string;
  post: Post;
}

const MAX_VISIBLE_IMAGES = 5;

const FacebookPostPreview: React.FC<FacebookPostPreviewProps> = ({
  accountName,
  post,
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
        <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
          Aucun média attaché
        </div>
      );
    }

    const count = visibleImages.length;

    const gridClass = (() => {
      if (count === 1) return "";
      if (count === 2) return "grid grid-cols-2 auto-rows-[180px] gap-1";
      if (count === 3) return "grid grid-cols-2 auto-rows-[160px] gap-1";
      if (count === 4) return "grid grid-cols-2 auto-rows-[150px] gap-1";
      return "grid grid-cols-3 auto-rows-[120px] gap-1";
    })();

    const getItemClass = (index: number) => {
      const base = "relative overflow-hidden rounded-md bg-black";
      if (count === 1) {
        return `${base} aspect-video`;
      }

      if (count === 2) {
        return `${base} aspect-square`;
      }

      if (count === 3) {
        if (index === 0) {
          return `${base} col-span-2 aspect-video`;
        }
        return `${base} aspect-square`;
      }

      if (count === 4) {
        return `${base} aspect-square`;
      }

      // count >= 5
      if (index === 0) {
        return `${base} col-span-2 row-span-2`;
      }

      if (index === 4) {
        return `${base} aspect-square`;
      }

      return `${base} aspect-square`;
    };

    return (
      <div className={gridClass}>
        {visibleImages.map((image, index) => (
          <div key={image.id ?? index} className={getItemClass(index)}>
            <img
              src={image.url}
              alt={post.title || `Image ${index + 1}`}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {remainingCount > 0 && index === visibleImages.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-semibold text-white">
                +{remainingCount}
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
      <p className="whitespace-pre-line text-sm text-gray-100">{textSections}</p>
    );
  };

  return (
    <div className="w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-800 bg-[#1b1d21] text-white shadow-lg">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-semibold uppercase">
          {initials || accountName[0] || "?"}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-semibold leading-tight">{accountName}</span>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <span>À l'instant</span>
            <span>•</span>
            <span>Public</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-1 w-1 rounded-full bg-gray-500" />
          <div className="h-1 w-1 rounded-full bg-gray-500" />
          <div className="h-1 w-1 rounded-full bg-gray-500" />
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        {renderContent()}
        <div className="overflow-hidden rounded-lg border border-gray-800">
          {renderMediaGrid()}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3 text-xs text-gray-400">
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
