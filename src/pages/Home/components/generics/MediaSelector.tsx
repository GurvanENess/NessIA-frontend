import { Images, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ImagePreview from "../../../../shared/components/ImagePreview";
import { db } from "../../../../shared/services/db";
import { logger } from "../../../../shared/utils/logger";
import { MediaWithUploadState } from "../../entities/media";
import { useImageUpload } from "../../hooks/useImageUpload";

interface MediaSelectorProps {
  selectedMedias: Array<{ id: string; url: string }>;
  onMediasChange: (medias: Array<{ id: string; url: string }>) => void;
  sessionId?: string;
  userToken?: string;
  companyId?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  selectedMedias,
  onMediasChange,
  sessionId,
  userToken,
  companyId,
}) => {
  const [allMedias, setAllMedias] = useState<MediaWithUploadState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convertir les médias sélectionnés en MediaWithUploadState pour la gestion interne
  const selectedMediaWithState = selectedMedias.map((media) => ({
    ...media,
    uploadState: "uploaded" as const,
  }));

  // Récupérer tous les médias de la session
  useEffect(() => {
    const fetchMedias = async () => {
      if (!sessionId) return;

      setIsLoading(true);
      try {
        const medias = await db.getMediasBySessionId(sessionId);
        const convertedMedias: MediaWithUploadState[] = medias.map((media) => ({
          ...media,
          uploadState: "uploaded" as const,
        }));
        setAllMedias(convertedMedias);
      } catch (error) {
        logger.error("Error fetching session medias:", error);
        toast.error("Erreur lors du chargement des médias");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedias();
  }, [sessionId]);

  const { addFilesToUpload, uploadError } = useImageUpload({
    sessionId,
    userToken,
    companyId,
    onImagesChange: (newImages) => {
      // Mettre à jour la bibliothèque avec les nouvelles images uploadées
      setAllMedias(newImages);
    },
    onError: (error) => {
      logger.error("Upload error in MediaSelector:", error);
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

  const handleMediaClick = (media: MediaWithUploadState) => {
    const isSelected = selectedMedias.some((m) => m.id === media.id);

    if (isSelected) {
      // Désélectionner
      const updated = selectedMedias.filter((m) => m.id !== media.id);
      onMediasChange(updated);
    } else {
      // Sélectionner
      const updated = [...selectedMedias, { id: media.id, url: media.url }];
      onMediasChange(updated);
    }
  };

  const handleRemoveSelected = (mediaId: string) => {
    const updated = selectedMedias.filter((m) => m.id !== mediaId);
    onMediasChange(updated);
  };

  // Filtrer les médias non sélectionnés pour la bibliothèque
  const unselectedMedias = allMedias.filter(
    (media) => !selectedMedias.some((selected) => selected.id === media.id)
  );

  return (
    <div className="space-y-4">
      {/* Médias sélectionnés */}
      <div>
        <div className="flex items-center mb-2">
          <Images className="w-4 h-4 text-gray-600 mr-2" />
          <h4 className="text-sm font-semibold text-gray-800">Médias sélectionnés</h4>
          <span className="ml-2 text-xs text-gray-500">({selectedMedias.length})</span>
        </div>

        {selectedMedias.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">
              Aucun média sélectionné. Cliquez sur un média ci-dessous pour le sélectionner.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
            {selectedMedias.map((media, index) => (
              <div key={media.id} className="relative">
                <ImagePreview
                  src={media.url}
                  alt={`Selected media ${index + 1}`}
                  size="sm"
                  showDeleteButton
                  onDelete={() => handleRemoveSelected(media.id)}
                />
                <div className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bibliothèque de médias */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Images className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="text-sm font-semibold text-gray-800">Bibliothèque</h4>
            <span className="ml-2 text-xs text-gray-500">({unselectedMedias.length})</span>
          </div>
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center gap-1 px-2 py-1 bg-[#7C3AED] text-white rounded text-xs hover:bg-[#6D28D9] transition-colors"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>

        {uploadError && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            Erreur d'upload : {uploadError}
          </div>
        )}

        {isLoading ? (
          <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">Chargement des médias...</p>
          </div>
        ) : unselectedMedias.length === 0 ? (
          <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
            <Images className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">
              {allMedias.length === 0
                ? "Aucun média dans cette conversation. Cliquez sur 'Ajouter' pour en ajouter."
                : "Tous les médias sont sélectionnés"}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 border-2 border-gray-200 rounded-lg p-3 bg-white">
            {unselectedMedias.map((media) => (
              <div
                key={media.id}
                className="relative cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleMediaClick(media)}
              >
                <ImagePreview
                  src={media.url}
                  alt="Library media"
                  size="sm"
                  draggable={false}
                  isUploading={media.uploadState === "uploading"}
                />
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          <span className="font-medium">Cliquez</span> sur un média pour le sélectionner/désélectionner
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

export default MediaSelector;

