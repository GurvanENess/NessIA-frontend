import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { InstagramPostProps } from "../entities/PostTypes";

const InstagramPost: React.FC<InstagramPostProps> = ({
  images,
  caption,
  hashtags,
  username = "nessia",
  profileImage = "/assets/nessia_logo.svg",
  likes = 56,
  comments = 16,
  timestamp = "Just now",
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // S'assurer qu'on a au moins une image par défaut
  const imageList = images?.length
    ? images.map((image) => image.url)
    : ["/assets/default.jpg"];
  const hasMultipleImages = imageList.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  }, [imageList.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  }, [imageList.length]);

  const goToImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < imageList.length) {
        setCurrentImageIndex(index);
      }
    },
    [imageList.length]
  );

  // Support des touches clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hasMultipleImages) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
      }
    };

    // On ajoute l'événement seulement si le composant est focusé
    const currentElement = document.activeElement;
    if (currentElement && currentElement.closest(".instagram-post-carousel")) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [goToPrevious, goToNext, hasMultipleImages]);

  return (
    <div
      className={`max-w-[470px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden instagram-post-carousel ${className}`}
      tabIndex={hasMultipleImages ? 0 : -1}
    >
      {/* Instagram Post Header */}
      <div className="flex items-center p-3 border-b">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={profileImage}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{username}</p>
        </div>
      </div>

      {/* Post Images Carousel */}
      <div className="relative aspect-square overflow-hidden">
        {/* Carousel Track */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {imageList.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post content ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* Flèches de navigation (seulement si plusieurs images) */}
        {hasMultipleImages && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all duration-200 hover:scale-105 z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentImageIndex < imageList.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all duration-200 hover:scale-105 z-10"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* Indicateurs de position (seulement si plusieurs images) */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75 hover:scale-105"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <button className="hover:opacity-70 transition-opacity">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold mb-2">{likes} likes</p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{username}</span>
          <span style={{ whiteSpace: "pre-line" }}>{caption}</span>
        </div>

        {/* Hashtags */}
        <div className="text-sm text-blue-900 flex flex-wrap">
          {hashtags
            .split(" ")
            .filter((tag) => tag.trim().length > 0)
            .map((tag, index) => (
              <span key={index} className="mr-1">
                {"#" + tag}
              </span>
            ))}
        </div>

        {/* Comments */}
        <p className="text-sm text-gray-500 mt-2">
          View all {comments} comments
        </p>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default InstagramPost;
