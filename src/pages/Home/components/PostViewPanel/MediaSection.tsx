import { Images, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import ImagePreview from "../../../../shared/components/ImagePreview";

// TODO: Fonctionnalités de suppression, d'ajout et de repositionnement des images à implémenter.

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: { id: string; url: string }[] = [];
    const fileArray = Array.from(files);

    let processed = 0;
    console.log(fileArray);
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

  const handleRemoveImage = async (index: number) => {
    if (typeof onDeleteImage !== "function") {
      console.error("onDeleteImage is not a function:", onDeleteImage);
      return;
    }
    try {
      await onDeleteImage(images[index].id);
      // Mise à jour locale de la liste des images après suppression
      const updatedImages = images.filter((_, i) => i !== index);
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
                <ImagePreview
                  key={index}
                  src={image.url}
                  alt={`Média ${index + 1}`}
                  size="md"
                  showDeleteButton={true}
                  onDelete={() => handleRemoveImage(index)}
                  draggable={true}
                  dragIndex={index}
                  onDragStart={handleImageDragStart}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  onDragEnd={handleImageDragEnd}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                  onClick={() => {
                    // Empêcher le clic si on vient de faire un drag
                    if (draggedIndex !== null) {
                      return;
                    }
                  }}
                />
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
  );
};

export default MediaSection;
