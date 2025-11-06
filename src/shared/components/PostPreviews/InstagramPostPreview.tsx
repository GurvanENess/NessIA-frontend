import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { PostPreviewProps } from "./types";

/**
 * Composant de preview pour les posts Instagram
 */
const InstagramPostPreview: React.FC<PostPreviewProps> = ({
  post,
  accountName,
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = post.images ?? [];
  const caption = post.description ?? "";
  const hashtags = (post.hashtags || []).join(" ");

  // S'assurer qu'on a au moins une image par défaut
  const imageList = images.length ? images.map((image) => image.url) : [];
  const hasMultipleImages = imageList.length > 1;
  const hasNoImages = imageList.length === 0;

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
      className={`max-w-[470px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden instagram-post-carousel ${className ?? ""}`}
      tabIndex={hasMultipleImages ? 0 : -1}
    >
      {/* Instagram Post Header */}
      <div className="flex items-center p-3 border-b">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src="/assets/nessia_logo.svg"
            alt={`${accountName}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{accountName}</p>
        </div>
      </div>

      {/* Post Images Carousel */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {hasNoImages ? (
          /* Message d'aide quand pas d'image */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ajoutez vos visuels
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Instagram adore les belles images ! 📸
                <br />
                Sélectionnez des médias depuis votre bibliothèque
                <br />
                dans l'onglet <span className="font-semibold text-purple-700">Éditer</span>
              </p>
            </div>
          </div>
        ) : (
          /* Carousel Track */
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
        )}

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
        <p className="text-sm font-semibold mb-2">56 likes</p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{accountName}</span>
          <span style={{ whiteSpace: "pre-line" }}>{caption}</span>
        </div>

        {/* Hashtags */}
        {hashtags && (
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
        )}

        {/* Comments */}
        <p className="text-sm text-gray-500 mt-2">View all 16 comments</p>
        <p className="text-xs text-gray-400 mt-1">Just now</p>
      </div>
    </div>
  );
};

export default InstagramPostPreview;

