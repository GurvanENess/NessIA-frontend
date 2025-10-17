import React from "react";
import ImagePreview from "../../../../shared/components/ImagePreview";
import { MediaWithMetadata } from "../../../../shared/entities/MediaTypes";

interface ChatImageMessageProps {
  /** Images à afficher dans le message */
  images: MediaWithMetadata[];
  /** Classe CSS pour le conteneur */
  className?: string;
  /** Afficher en mode compact (plus petites images) */
  compact?: boolean;
  /** Indique si les images sont en cours d'upload */
  isLoading?: boolean;
}

/**
 * Composant pour afficher des images dans un message de chat
 * Utilise ImagePreview pour la fonctionnalité de zoom
 */
const ChatImageMessage: React.FC<ChatImageMessageProps> = ({
  images,
  className = "",
  compact = false,
  isLoading = false,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  // Choix de la taille selon le mode et le nombre d'images
  const getImageSize = () => {
    if (compact) return "sm";
    if (images.length === 1) return "lg";
    if (images.length <= 2) return "md";
    return "sm";
  };

  const imageSize = getImageSize();

  // Limiter l'affichage à 6 images maximum
  const displayedImages = images.slice(0, 6);
  const hiddenCount = images.length - displayedImages.length;

  return (
    <div className={className}>
      {/* Grille d'images adaptative */}
      <div
        className={`
          grid gap-2 
          ${displayedImages.length === 1 ? "grid-cols-1" : ""}
          ${displayedImages.length === 2 ? "grid-cols-2" : ""}
          ${displayedImages.length >= 3 ? "grid-cols-3" : ""}
          max-w-sm
        `}
      >
        {displayedImages.map((image, index) => (
          <ImagePreview
            key={image.id || index}
            src={image.url}
            alt={image.alt || `Image ${index + 1}`}
            size={imageSize}
            showZoomIcon={true}
            isUploading={isLoading}
            containerClassName="shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden"
          />
        ))}
      </div>

      {/* Indicateur si plus d'images */}
      {hiddenCount > 0 && (
        <p className="text-xs opacity-70 mt-2">
          +{hiddenCount} image{hiddenCount > 1 ? "s" : ""} supplémentaire
          {hiddenCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default ChatImageMessage;
