import { Images, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ImagePreview from "../../../../shared/components/ImagePreview";
import { db } from "../../../../shared/services/db";
import { logger } from "../../../../shared/utils/logger";
import { MediaWithUploadState } from "../../entities/media";
import { useImageUpload } from "../../hooks/useImageUpload";

interface MediaLibraryProps {
  allMedias: MediaWithUploadState[]; // Tous les médias de la session
  selectedMedias: MediaWithUploadState[]; // Médias sélectionnés pour le post
  onMediasChange: (selectedMedias: MediaWithUploadState[], allMedias: MediaWithUploadState[]) => void;
  onDeleteImage: (imageId: string) => Promise<void>;
  sessionId?: string;
  userToken?: string;
  companyId?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  allMedias,
  selectedMedias,
  onMediasChange,
  onDeleteImage,
  sessionId,
  userToken,
  companyId,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedMedia, setDraggedMedia] = useState<MediaWithUploadState | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<"library" | "selected" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addFilesToUpload, uploadError } = useImageUpload({
    sessionId,
    userToken,
    companyId,
    onImagesChange: (newImages) => {
      // Mettre à jour la bibliothèque avec les nouvelles images uploadées
      onMediasChange(selectedMedias, newImages);
    },
    onError: (error) => {
      logger.error("Upload error in MediaLibrary:", error);
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    await addFilesToUpload(files, allMedias);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  // Fonction utilitaire pour mettre à jour le champ selected dans allMedias
  const updateMediaInAllMedias = (mediaId: string, selected: boolean, position?: number) => {
    return allMedias.map((m) => {
      if (m.id === mediaId) {
        return { ...m, selected, ...(position !== undefined && { position }) };
      }
      return m;
    });
  };

  const handleDeselectMedia = async (media: MediaWithUploadState) => {
    // Désélectionner un média (le retirer de la sélection)
    const updatedSelected = selectedMedias.filter((m) => m.id !== media.id);
    const reindexed = updatedSelected.map((m, idx) => ({
      ...m,
      position: idx,
    }));

    try {
      await db.updateMediaSelection(media.id, false);
      
      // Mettre à jour les positions des médias restants
      for (let i = 0; i < reindexed.length; i++) {
        await db.updateMediaSelection(reindexed[i].id, true, i);
      }

      // Mettre à jour allMedias avec le nouveau statut
      const updatedAllMedias = updateMediaInAllMedias(media.id, false);

      onMediasChange(reindexed, updatedAllMedias);
      toast.success("Média désélectionné");
    } catch (error) {
      logger.error("Error deselecting media:", error);
      toast.error("Erreur lors de la désélection du média");
    }
  };

  const handleDeleteMedia = async (imageId: string) => {
    // Supprimer définitivement un média
    try {
      await onDeleteImage(imageId);
      const updatedAllMedias = allMedias.filter((media) => media.id !== imageId);
      const updatedSelectedMedias = selectedMedias.filter((media) => media.id !== imageId);
      
      // Recalculer les positions
      const reindexedSelected = updatedSelectedMedias.map((media, idx) => ({
        ...media,
        position: idx,
      }));

      onMediasChange(reindexedSelected, updatedAllMedias);
      toast.success("Média supprimé");
    } catch (error) {
      logger.error("Error while deleting image:", error);
      toast.error("Erreur lors de la suppression du média");
    }
  };

  // Gestion du drag depuis la bibliothèque vers la sélection
  const handleLibraryDragStart = (event: React.DragEvent, media: MediaWithUploadState) => {
    setDraggedMedia(media);
    setDragSource("library");
    event.dataTransfer.effectAllowed = "copy";
  };

  // Gestion du drag dans la zone de sélection
  const handleSelectedDragStart = (event: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setDraggedMedia(selectedMedias[index]);
    setDragSource("selected");
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSelectedDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = dragSource === "library" ? "copy" : "move";
    setDragOverIndex(index);
  };

  const handleSelectedDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleSelectedDrop = async (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    setDragOverIndex(null);

    if (!draggedMedia) return;

    if (dragSource === "library") {
      // Ajouter depuis la bibliothèque
      const isAlreadySelected = selectedMedias.some((m) => m.id === draggedMedia.id);
      if (isAlreadySelected) {
        toast.error("Ce média est déjà sélectionné");
        setDraggedMedia(null);
        setDragSource(null);
        return;
      }

      const newSelected = [...selectedMedias];
      newSelected.splice(dropIndex, 0, { ...draggedMedia, selected: true });

      // Recalculer les positions
      const reindexed = newSelected.map((media, idx) => ({
        ...media,
        position: idx,
      }));

      // Mettre à jour en base de données
      try {
        await db.updateMediaSelection(draggedMedia.id, true, dropIndex);
        
        // Mettre à jour les positions des autres médias
        for (let i = 0; i < reindexed.length; i++) {
          if (reindexed[i].id !== draggedMedia.id) {
            await db.updateMediaSelection(reindexed[i].id, true, i);
          }
        }

        // Mettre à jour allMedias avec le nouveau statut
        const updatedAllMedias = updateMediaInAllMedias(draggedMedia.id, true, dropIndex);

        onMediasChange(reindexed, updatedAllMedias);
        toast.success("Média ajouté au post");
      } catch (error) {
        logger.error("Error updating media selection:", error);
        toast.error("Erreur lors de la sélection du média");
      }
    } else if (dragSource === "selected" && draggedIndex !== null) {
      // Réorganiser dans la sélection
      if (draggedIndex === dropIndex) {
        setDraggedMedia(null);
        setDraggedIndex(null);
        setDragSource(null);
        return;
      }

      const updatedSelected = [...selectedMedias];
      const [movedMedia] = updatedSelected.splice(draggedIndex, 1);
      updatedSelected.splice(dropIndex, 0, movedMedia);

      // Recalculer les positions
      const reindexed = updatedSelected.map((media, idx) => ({
        ...media,
        position: idx,
      }));

      // Mettre à jour en base de données
      try {
        for (let i = 0; i < reindexed.length; i++) {
          await db.updateMediaSelection(reindexed[i].id, true, i);
        }

        onMediasChange(reindexed, allMedias);
      } catch (error) {
        logger.error("Error updating media positions:", error);
        toast.error("Erreur lors du réarrangement des médias");
      }
    }

    setDraggedMedia(null);
    setDraggedIndex(null);
    setDragSource(null);
  };

  const handleSelectedAreaDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (!draggedMedia || dragSource !== "library") return;

    const isAlreadySelected = selectedMedias.some((m) => m.id === draggedMedia.id);
    if (isAlreadySelected) {
      toast.error("Ce média est déjà sélectionné");
      setDraggedMedia(null);
      setDragSource(null);
      return;
    }

    const newSelected = [...selectedMedias, { ...draggedMedia, selected: true }];
    
    // Recalculer les positions
    const reindexed = newSelected.map((media, idx) => ({
      ...media,
      position: idx,
    }));

    // Mettre à jour en base de données
    try {
      await db.updateMediaSelection(draggedMedia.id, true, selectedMedias.length);
      
      // Mettre à jour allMedias avec le nouveau statut
      const updatedAllMedias = updateMediaInAllMedias(draggedMedia.id, true, selectedMedias.length);
      
      onMediasChange(reindexed, updatedAllMedias);
      toast.success("Média ajouté au post");
    } catch (error) {
      logger.error("Error updating media selection:", error);
      toast.error("Erreur lors de la sélection du média");
    }

    setDraggedMedia(null);
    setDragSource(null);
  };

  // Gestion du drop dans la zone bibliothèque pour désélectionner
  const handleLibraryAreaDrop = async (event: React.DragEvent) => {
    event.preventDefault();

    if (!draggedMedia || dragSource !== "selected") return;

    // Désélectionner le média
    await handleDeselectMedia(draggedMedia);

    setDraggedMedia(null);
    setDraggedIndex(null);
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDraggedMedia(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragSource(null);
  };

  const handleMediaClick = async (media: MediaWithUploadState) => {
    const isSelected = selectedMedias.some((m) => m.id === media.id);
    
    if (isSelected) {
      // Désélectionner
      const updatedSelected = selectedMedias.filter((m) => m.id !== media.id);
      const reindexed = updatedSelected.map((m, idx) => ({
        ...m,
        position: idx,
      }));

      try {
        await db.updateMediaSelection(media.id, false);
        
        // Mettre à jour les positions des médias restants
        for (let i = 0; i < reindexed.length; i++) {
          await db.updateMediaSelection(reindexed[i].id, true, i);
        }

        // Mettre à jour allMedias avec le nouveau statut
        const updatedAllMedias = updateMediaInAllMedias(media.id, false);

        onMediasChange(reindexed, updatedAllMedias);
      } catch (error) {
        logger.error("Error deselecting media:", error);
        toast.error("Erreur lors de la désélection du média");
      }
    } else {
      // Sélectionner
      const newSelected = [...selectedMedias, { ...media, selected: true }];
      const reindexed = newSelected.map((m, idx) => ({
        ...m,
        position: idx,
      }));

      try {
        await db.updateMediaSelection(media.id, true, selectedMedias.length);
        
        // Mettre à jour allMedias avec le nouveau statut
        const updatedAllMedias = updateMediaInAllMedias(media.id, true, selectedMedias.length);
        
        onMediasChange(reindexed, updatedAllMedias);
        toast.success("Média ajouté au post");
      } catch (error) {
        logger.error("Error selecting media:", error);
        toast.error("Erreur lors de la sélection du média");
      }
    }
  };

  // Filtrer les médias non sélectionnés pour la bibliothèque
  const unselectedMedias = allMedias.filter(
    (media) => !selectedMedias.some((selected) => selected.id === media.id)
  );

  return (
    <div className="rounded-lg space-y-6">
      {/* Médias sélectionnés */}
      <div>
        <div className="flex items-center mb-4">
          <Images className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Médias du post</h3>
          <span className="ml-2 text-sm text-gray-500">({selectedMedias.length})</span>
        </div>

        <div
          className={`border-2 border-dashed ${
            isDragOver && dragSource === "library"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300"
          } rounded-lg p-4 min-h-[120px] transition-colors`}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragSource === "library") setIsDragOver(true);
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleSelectedAreaDrop}
        >
          {selectedMedias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Images className="w-12 h-12 mb-2" />
              <p className="text-sm text-center">
                Glissez des médias ici depuis la bibliothèque
                <br />
                <span className="text-xs">ou cliquez sur un média ci-dessous</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedMedias.map((media, index) => (
                <div key={media.id} className="relative">
                  <ImagePreview
                    src={media.url}
                    alt={`Selected media ${index + 1}`}
                    size="md"
                    showDeleteButton
                    onDelete={() => handleDeselectMedia(media)}
                    draggable
                    dragIndex={index}
                    onDragStart={(e, idx) => handleSelectedDragStart(e, idx)}
                    onDragOver={(e, idx) => handleSelectedDragOver(e, idx)}
                    onDragLeave={handleSelectedDragLeave}
                    onDrop={(e, idx) => handleSelectedDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedIndex === index && dragSource === "selected"}
                    isDragOver={dragOverIndex === index}
                    isUploading={media.uploadState === "uploading"}
                  />
                  <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bibliothèque de médias */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Images className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Bibliothèque</h3>
            <span className="ml-2 text-sm text-gray-500">({unselectedMedias.length})</span>
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Erreur d'upload : {uploadError}</p>
          </div>
        )}

        <div
          className={`border-2 rounded-lg bg-white p-3 min-h-[120px] transition-colors ${
            dragSource === "selected" ? "border-purple-300 bg-purple-50" : "border-gray-200"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragSource === "selected") {
              e.dataTransfer.dropEffect = "move";
            }
          }}
          onDrop={handleLibraryAreaDrop}
        >
          {unselectedMedias.length === 0 && dragSource !== "selected" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Images className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center mb-4">
                {allMedias.length === 0
                  ? "Aucun média dans cette conversation"
                  : "Tous les médias sont sélectionnés"}
              </p>
            </div>
          ) : dragSource === "selected" && unselectedMedias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-purple-600">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <p className="text-sm font-medium">Déposez ici pour désélectionner</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unselectedMedias.map((media, index) => (
                <div
                  key={media.id}
                  draggable
                  onDragStart={(e) => handleLibraryDragStart(e, media)}
                  onDragEnd={handleDragEnd}
                  className="relative"
                >
                  <ImagePreview
                    src={media.url}
                    alt={`Library media ${index + 1}`}
                    size="md"
                    draggable={false}
                    showDeleteButton
                    onDelete={() => handleDeleteMedia(media.id)}
                    isUploading={media.uploadState === "uploading"}
                    onClick={() => handleMediaClick(media)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">Cliquez</span> pour sélectionner • <span className="font-medium">Glissez</span> pour réorganiser • <span className="font-medium">Croix rouge</span> pour supprimer
        </p>
      </div>

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

export default MediaLibrary;

