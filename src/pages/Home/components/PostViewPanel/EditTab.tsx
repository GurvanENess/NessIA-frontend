import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../../shared/contexts/AppContext";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import { PostData } from "../../../../shared/entities/PostTypes";
import { Post } from "../../../Posts/entities/PostTypes";
import { MediaWithUploadState } from "../../entities/media";
import MediaLibrary from "./MediaLibrary";

interface EditTabProps {
  post: Post;
  images: MediaWithUploadState[];
  allSessionMedias: MediaWithUploadState[];
  onImagesChange: (images: MediaWithUploadState[], allMedias?: MediaWithUploadState[]) => void;
  onSave: (data: PostData) => Promise<void>;
  onDeleteImage: (imageId: string) => Promise<void>;
}

const EditTab: React.FC<EditTabProps> = ({
  post,
  images,
  allSessionMedias,
  onImagesChange,
  onSave,
  onDeleteImage,
}) => {
  const { state } = useApp();
  const { user } = useAuth();

  const [caption, setCaption] = useState(post.description);
  const [originalCaption, setOriginalCaption] = useState(post.description);
  const [isSaving, setIsSaving] = useState(false);

  const isPublished = post.status === "published";
  const hasChanges = caption !== originalCaption;

  useEffect(() => {
    setCaption(post.description);
    setOriginalCaption(post.description);
  }, [post]);

  const handleSave = async () => {
    if (isPublished) return;
    setIsSaving(true);

    // Calculer les images uploadées avec leurs positions
    const uploadedImages = images
      .filter((image) => image.uploadState === "uploaded")
      .map((image, index) => ({
        id: image.id,
        url: image.url,
        position: image.position ?? index,
      }));

    // Créer le tableau des positions pour la sauvegarde
    const imagePositions = uploadedImages.map((image) => ({
      id: image.id,
      position: image.position ?? 0,
    }));

    const formData: PostData = {
      images: uploadedImages,
      caption,
      hashtags: "", // Les hashtags font maintenant partie de la légende
      imagePositions,
    };

    await onSave(formData);
    // Mettre à jour la légende originale après la sauvegarde
    setOriginalCaption(caption);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setCaption(originalCaption);
  };

  const handleMediasChange = (selectedMedias: MediaWithUploadState[], updatedAllMedias: MediaWithUploadState[]) => {
    // Mettre à jour les médias sélectionnés ET tous les médias de la session
    onImagesChange(selectedMedias, updatedAllMedias);
  };

  return (
    <div className="space-y-6">
      {isPublished && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-green-600 mt-0.5">ℹ️</div>
          <div>
            <p className="text-green-800 font-medium">Ce post est publié</p>
            <p className="text-green-700 text-sm mt-1">
              L'édition n'est plus disponible pour un post déjà publié. Vous
              pouvez uniquement consulter son contenu.
            </p>
          </div>
        </div>
      )}
      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <Pencil className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Légende</h3>
        </div>
        <textarea
          className="w-full p-3 border-2 border-gray-200 rounded-md text-base bg-white disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
          placeholder="Décrivez votre post... (incluez vos #hashtags)"
          rows={4}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          disabled={isPublished}
        />
        <p className="text-xs text-gray-500 mt-1">
          Les hashtags font partie de la légende
        </p>
      </div>

      {hasChanges && !isPublished && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      )}

      <MediaLibrary
        allMedias={allSessionMedias}
        selectedMedias={images}
        onMediasChange={handleMediasChange}
        onDeleteImage={onDeleteImage}
        sessionId={state.chat.sessionId || undefined}
        userToken={user?.token}
        companyId={state.currentCompany?.id}
      />
    </div>
  );
};

export default EditTab;
