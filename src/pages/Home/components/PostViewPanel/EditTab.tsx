import { Hash, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../../shared/contexts/AppContext";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import { PostData } from "../../../../shared/entities/PostTypes";
import { Post } from "../../../Posts/entities/PostTypes";
import { MediaWithUploadState } from "../../entities/media";
import MediaSection from "./MediaSection";

interface EditTabProps {
  post: Post;
  images: MediaWithUploadState[];
  onImagesChange: (images: MediaWithUploadState[]) => void;
  onSave: (data: PostData) => Promise<void>;
  onCancel: () => void;
  onDeleteImage: (imageId: string) => Promise<void>;
}

const EditTab: React.FC<EditTabProps> = ({
  post,
  images,
  onImagesChange,
  onSave,
  onCancel,
  onDeleteImage,
}) => {
  const { state } = useApp();
  const { user } = useAuth();

  const [caption, setCaption] = useState(post.description);
  const [hashtags, setHashtags] = useState((post.hashtags || []).join(" "));
  const [isSaving, setIsSaving] = useState(false);

  console.log("post", post);

  useEffect(() => {
    setCaption(post.description);
    setHashtags((post.hashtags || []).join(" "));
  }, [post]);

  const handleSave = async () => {
    setIsSaving(true);

    // Calculer les images uploadées depuis l'état parent
    const uploadedImages = images
      .filter((image) => image.uploadState === "uploaded")
      .map((image) => ({ id: image.id, url: image.url }));

    const formData: PostData = {
      images: uploadedImages,
      caption,
      hashtags,
    };

    await onSave(formData);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setCaption(post.description);
    setHashtags((post.hashtags || []).join(" "));
    onCancel();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <Pencil className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Legende</h3>
        </div>
        <textarea
          className="w-full p-3 border-2 border-gray-200 rounded-md text-base bg-white"
          placeholder="Decrivez votre post..."
          rows={4}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
      </div>

      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <Hash className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Hashtags</h3>
        </div>
        <input
          type="text"
          className="w-full p-3 border-2 border-gray-200 rounded-md text-base bg-white"
          placeholder="marketing socialmedia"
          value={hashtags}
          onChange={(event) => setHashtags(event.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Separez les hashtags par des espaces
        </p>
      </div>

      <MediaSection
        images={images}
        onImagesChange={onImagesChange}
        onDeleteImage={onDeleteImage}
        sessionId={state.chat.sessionId || undefined}
        userToken={user?.token}
        companyId={state.currentCompany?.id}
      />

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
          className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50"
        >
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
};

export default EditTab;
