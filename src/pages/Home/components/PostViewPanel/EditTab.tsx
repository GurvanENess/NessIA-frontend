import { Pencil } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../../../../shared/contexts/AppContext";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import { PostData } from "../../../../shared/entities/PostTypes";
import { Post } from "../../../Posts/entities/PostTypes";
import { MediaWithUploadState } from "../../entities/media";
import MediaLibrary from "./MediaLibrary";
import PlatformSelector, { PlatformOption } from "./PlatformSelector";
import { normalizePlatformName } from "../../../../shared/utils/postUtils";

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
  const [selectedPlatformId, setSelectedPlatformId] = useState<number | null>(
    post.platformId ?? null
  );
  const [selectedPlatformName, setSelectedPlatformName] = useState<
    Post["platform"]
  >(post.platform);
  const [originalPlatformId, setOriginalPlatformId] = useState<number | null>(
    post.platformId ?? null
  );
  const [originalPlatformName, setOriginalPlatformName] = useState<
    Post["platform"]
  >(post.platform);
  const [isSaving, setIsSaving] = useState(false);

  const isPublished = post.status === "published";
  const hasChanges =
    caption !== originalCaption || selectedPlatformId !== originalPlatformId;

  const platformOptions = useMemo<PlatformOption[]>(() => {
    const options: PlatformOption[] = [];
    const seenIds = new Set<number>();

    const connectedPlatforms = state.currentCompany?.platforms ?? [];

    connectedPlatforms.forEach(
      ({ platform_id, platform_name, account_name }) => {
        if (platform_id === null || platform_id === undefined) {
          return;
        }

        const parsedId =
          typeof platform_id === "number" ? platform_id : Number(platform_id);

        if (Number.isNaN(parsedId)) {
          return;
        }

        const normalized = normalizePlatformName(platform_name);

        if (!seenIds.has(parsedId)) {
          seenIds.add(parsedId);
          options.push({
            id: parsedId,
            value: normalized,
            accountName: account_name ?? null,
            isConnected: true,
          });
        }
      }
    );

    if (
      post.platformId !== null &&
      post.platformId !== undefined &&
      !seenIds.has(post.platformId)
    ) {
      options.push({
        id: post.platformId,
        value: post.platform,
        accountName: null,
        isConnected: false,
      });
    }

    return options;
  }, [state.currentCompany?.platforms, post.platformId, post.platform]);

  useEffect(() => {
    setCaption(post.description);
    setOriginalCaption(post.description);
    setSelectedPlatformId(post.platformId ?? null);
    setOriginalPlatformId(post.platformId ?? null);
    setSelectedPlatformName(post.platform);
    setOriginalPlatformName(post.platform);
  }, [post]);

  useEffect(() => {
    if (platformOptions.length === 0) {
      return;
    }

    const isCurrentSelectionAvailable = platformOptions.some(
      (option) => option.id === selectedPlatformId
    );

    if (isCurrentSelectionAvailable) {
      const currentOption = platformOptions.find(
        (option) => option.id === selectedPlatformId
      );
      if (currentOption) {
        setSelectedPlatformName(currentOption.value);
      }
      return;
    }

    const defaultOption = platformOptions[0];
    setSelectedPlatformId(defaultOption.id);
    setSelectedPlatformName(defaultOption.value);
  }, [platformOptions, selectedPlatformId]);

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
      platform: selectedPlatformName,
      platformId: selectedPlatformId,
    };

    try {
      await onSave(formData);
      // Mettre à jour les valeurs originales après la sauvegarde
      setOriginalCaption(caption);
      setOriginalPlatformId(selectedPlatformId);
      setOriginalPlatformName(selectedPlatformName);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCaption(originalCaption);
    setSelectedPlatformId(originalPlatformId ?? null);
    setSelectedPlatformName(originalPlatformName);
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
      <PlatformSelector
        options={platformOptions}
        selectedPlatformId={selectedPlatformId}
        onSelectPlatform={(platformId) => {
          setSelectedPlatformId(platformId);
          const matchingOption = platformOptions.find(
            (option) => option.id === platformId
          );
          if (matchingOption) {
            setSelectedPlatformName(matchingOption.value);
          }
        }}
        disabled={isPublished || platformOptions.length === 0}
      />
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
