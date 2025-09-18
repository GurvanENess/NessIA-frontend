import { Images, Plus, X, ZoomIn } from "lucide-react";
import React, { useRef, useState } from "react";

// TODO: Functionnalités de suppression, d'ajout et de repositionnement des images à implémenter.

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

interface MediaSectionProps {
  images: { id: string; url: string }[];
  onImagesChange: (images: { id: string; url: string }[]) => void;
  onDeleteImage: (imageId: string) => Promise<void>;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  images,
  onImagesChange,
  onDeleteImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: { id: string; url: string }[] = [];
    const fileArray = Array.from(files);

    let processed = 0;
    fileArray.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            id: crypto.randomUUID(),
            url: reader.result as string,
          });
          processed++;
          if (processed === fileArray.length) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processed++;
        if (processed === fileArray.length) {
          onImagesChange([...images, ...newImages]);
        }
      }
    });
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleImageClick = (image: { id: string; url: string }) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleRemoveImage = async (
    indexToRemove: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (typeof onDeleteImage !== "function") {
      console.error("onDeleteImage is not a function:", onDeleteImage);
      return;
    }
    try {
      await onDeleteImage(images[indexToRemove].id);
      // Mise à jour locale de la liste des images après suppression
      const updatedImages = images.filter(
        (_, index) => index !== indexToRemove
      );
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  };

  // Fonctions de drag & drop pour réorganiser les images
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Supprimer l'image de sa position actuelle
    newImages.splice(draggedIndex, 1);

    // L'insérer à la nouvelle position
    newImages.splice(dropIndex, 0, draggedImage);

    onImagesChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      {/* Injection des styles CSS pour les animations */}
      <style>{modalStyles}</style>

      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <Images className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Médias</h3>
        </div>

        {/* Zone de dépôt et grille d'images */}
        <div
          className={`border-2 border-gray-200 rounded-md bg-white p-3 transition-colors ${
            isDragOver ? "bg-purple-50" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {images.length === 0 ? (
            // Zone vide avec bouton d'upload
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-col items-center justify-center py-8">
                <Images className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center mb-4">
                  Ajoutez des images pour votre post
                </p>
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Choisir des images
                </button>
              </div>
            </div>
          ) : (
            // Grille d'images avec bouton d'ajout
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-move w-20 h-20 flex-shrink-0 transition-all ${
                      draggedIndex === index ? "opacity-50 scale-105" : ""
                    } ${
                      dragOverIndex === index
                        ? "ring-2 ring-[#7C3AED] ring-offset-1"
                        : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleImageDragStart(e, index)}
                    onDragOver={(e) => handleImageDragOver(e, index)}
                    onDragLeave={handleImageDragLeave}
                    onDrop={(e) => handleImageDrop(e, index)}
                    onDragEnd={handleImageDragEnd}
                    onClick={(e) => {
                      // Empêcher le clic si on vient de faire un drag
                      if (draggedIndex !== null) {
                        e.preventDefault();
                        return;
                      }
                      handleImageClick(image);
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Média ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#7C3AED] transition-colors pointer-events-none"
                    />

                    {/* Overlay au hover avec animation élégante */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 ease-out rounded-lg flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-[1px]">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out" />
                    </div>

                    {/* Bouton de suppression avec animation */}
                    <button
                      onClick={(e) => handleRemoveImage(index, e)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out hover:bg-red-600 hover:scale-110 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton d'ajout de médias */}
        <button
          onClick={handleUploadClick}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter des médias
        </button>

        {/* Input file caché */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Modal d'agrandissement avec animations */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50 !mt-auto animate-fade-in backdrop-blur-0"
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
              alt="Image agrandie"
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

export default MediaSection;
