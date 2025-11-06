import { Images, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import ImagePreview from "../../../../shared/components/ImagePreview";
import { MediaWithUploadState } from "../../entities/media";
import { useImageUpload } from "../../hooks/useImageUpload";

interface MediaSectionProps {
  images: MediaWithUploadState[];
  onImagesChange: (images: MediaWithUploadState[]) => void;
  onDeleteImage: (imageId: string) => Promise<void>;
  sessionId?: string;
  userToken?: string;
  companyId?: string;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  images,
  onImagesChange,
  onDeleteImage,
  sessionId,
  userToken,
  companyId,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addFilesToUpload, uploadError } = useImageUpload({
    sessionId,
    userToken,
    companyId,
    onImagesChange,
    onError: (error) => {
      console.error("Upload error in MediaSection:", error);
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) {
      return;
    }
    await addFilesToUpload(files, images);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileSelect(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    await handleFileSelect(event.dataTransfer.files);
  };

  const handleRemoveImage = async (index: number) => {
    if (typeof onDeleteImage !== "function") {
      console.error("onDeleteImage is not a function:", onDeleteImage);
      return;
    }

    try {
      await onDeleteImage(images[index].id);
      const updatedImages = images.filter((_, position) => position !== index);

      // Recalculer les positions après suppression
      const imagesWithUpdatedPositions = updatedImages.map((image, idx) => ({
        ...image,
        position: idx, // Réassigner les positions après suppression
      }));

      onImagesChange(imagesWithUpdatedPositions);
    } catch (error) {
      console.error("Error while deleting image:", error);
    }
  };

  const handleImageDragStart = (event: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.currentTarget.outerHTML);
  };

  const handleImageDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedImages = [...images];
    const draggedImage = updatedImages[draggedIndex];
    updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(dropIndex, 0, draggedImage);

    // Mettre à jour les positions après le réarrangement
    const imagesWithUpdatedPositions = updatedImages.map((image, index) => ({
      ...image,
      position: index, // Assigner la position basée sur l'index
    }));

    onImagesChange(imagesWithUpdatedPositions);
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
        <h3 className="text-lg font-semibold text-gray-800">Medias</h3>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            Erreur d'upload : {uploadError}
          </p>
        </div>
      )}

      <div
        className={`border-2 border-gray-200 rounded-md bg-white p-3 transition-colors ${
          isDragOver ? "bg-purple-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
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
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <ImagePreview
                  key={image.id || `temp-${index}`}
                  src={image.url}
                  alt={`Media ${index + 1}`}
                  size="md"
                  showDeleteButton
                  onDelete={() => handleRemoveImage(index)}
                  draggable
                  dragIndex={index}
                  onDragStart={handleImageDragStart}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  onDrop={handleImageDrop}
                  onDragEnd={handleImageDragEnd}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                  isUploading={image.uploadState === "uploading"}
                  onClick={() => {
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

      <button
        onClick={handleUploadClick}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Ajouter des medias
      </button>

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
