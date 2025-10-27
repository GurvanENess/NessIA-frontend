import { Loader2, X, ZoomIn } from "lucide-react";
import React, { useState } from "react";

// Styles CSS pour les animations du modal
const modalStyles = `
  @keyframes fadeInBackdrop {
    from {
      background-color: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
    }
    to {
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
    }
  }

  @keyframes scaleInImage {
    from {
      transform: scale(0.75);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeInButton {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export interface ImagePreviewData {
  id: string;
  url: string;
  alt?: string;
}

interface ImagePreviewProps {
  /** URL de l'image à afficher */
  src: string;
  /** Texte alternatif pour l'image */
  alt?: string;
  /** Classes CSS personnalisées pour l'image */
  className?: string;
  /** Classes CSS pour le conteneur */
  containerClassName?: string;
  /** Taille de l'image en mode grid */
  size?: "sm" | "md" | "lg" | "auto";
  /** Afficher l'icône de zoom au hover */
  showZoomIcon?: boolean;
  /** Fonction appelée quand l'image est cliquée (avant l'ouverture du modal) */
  onClick?: () => void;
  /** Désactiver le modal de zoom */
  disableModal?: boolean;
  /** Afficher le bouton de suppression */
  showDeleteButton?: boolean;
  /** Fonction appelée lors de la suppression */
  onDelete?: () => void;
  /** Permettre le drag & drop */
  draggable?: boolean;
  /** Index pour les opérations de drag & drop */
  dragIndex?: number;
  /** Fonctions de drag & drop */
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  /** Indiquer si l'élément est en cours de drag */
  isDragging?: boolean;
  /** Indiquer si l'élément est survolé pendant un drag */
  isDragOver?: boolean;
  /** Indiquer si l'image est en cours d'upload */
  isUploading?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
  auto: "w-full h-full",
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "Image",
  className = "",
  containerClassName = "",
  size = "md",
  showZoomIcon = true,
  onClick,
  disableModal = false,
  showDeleteButton = false,
  onDelete,
  draggable = false,
  dragIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  isUploading = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImagePreviewData | null>(
    null
  );

  const handleImageClick = () => {
    onClick?.();
    if (!disableModal) {
      setSelectedImage({ id: "preview", url: src, alt });
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const sizeClass = size === "auto" ? "" : sizeClasses[size];

  return (
    <>
      {/* Injection des styles CSS pour les animations */}
      <style>{modalStyles}</style>

      <div
        className={`relative group cursor-pointer flex-shrink-0 transition-all ${sizeClass} ${
          isDragging ? "opacity-50 scale-105" : ""
        } ${
          isDragOver ? "ring-2 ring-[#7C3AED] ring-offset-1" : ""
        } ${containerClassName}`}
        draggable={draggable}
        onDragStart={(e) =>
          dragIndex !== undefined && onDragStart?.(e, dragIndex)
        }
        onDragOver={(e) =>
          dragIndex !== undefined && onDragOver?.(e, dragIndex)
        }
        onDragLeave={onDragLeave}
        onDrop={(e) => dragIndex !== undefined && onDrop?.(e, dragIndex)}
        onDragEnd={onDragEnd}
        onClick={handleImageClick}
      >
        <img
          src={src}
          alt={alt}
          className={`object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#7C3AED] transition-colors pointer-events-none ${
            size === "auto" ? "w-full h-full" : "w-full h-full"
          } ${className}`}
        />

        {/* Overlay au hover avec animation élégante */}
        {showZoomIcon && !disableModal && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 ease-out rounded-lg flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-[1px]">
            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out" />
          </div>
        )}

        {/* Overlay de loading pour l'upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Bouton de suppression avec animation */}
        {showDeleteButton && onDelete && !isUploading && (
          <button
            onClick={handleDelete}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out hover:bg-red-600 hover:scale-110 shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modal d'agrandissement avec animations */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-[100] !mt-auto animate-fade-in backdrop-blur-0"
          style={{
            animation: "fadeInBackdrop 0.3s ease-out forwards",
          }}
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-full p-4 transform scale-75 opacity-0"
            style={{
              animation: "scaleInImage 0.4s ease-out forwards 0.1s",
            }}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || "Image agrandie"}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 opacity-0 shadow-lg"
              style={{
                animation: "fadeInButton 0.3s ease-out forwards 0.3s",
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
