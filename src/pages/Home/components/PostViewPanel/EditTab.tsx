import { Hash, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PostData } from "../../../../shared/entities/PostTypes";
import { Post } from "../../../Posts/entities/PostTypes";
import MediaSection from "./MediaSection";

interface EditTabProps {
  post: Post;
  onSave: (data: PostData) => Promise<void>;
  onCancel: () => void;
  onDeleteImage: (imageId: string) => Promise<void>;
}

const EditTab: React.FC<EditTabProps> = ({
  post,
  onSave,
  onCancel,
  onDeleteImage,
}) => {
  const [formData, setFormData] = useState<PostData>({
    images: post.images || [],
    caption: post.description,
    hashtags: (post.hashtags || []).join(" "),
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("post.hashtags", post.hashtags?.join(" "));
    setFormData({
      images: post.images || [],
      caption: post.description,
      hashtags: (post.hashtags || []).join(" "),
    });
  }, [post]);

  const handleSave = async () => {
    console.log("formData", formData);
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      images: post.images || [],
      caption: post.description,
      hashtags: (post.hashtags || []).join(" "),
    });
    onCancel();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <Pencil className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Légende</h3>
        </div>
        <textarea
          className="w-full p-3 border-2 border-gray-200 rounded-md text-base bg-white"
          placeholder="Décrivez votre post..."
          rows={4}
          value={formData.caption}
          onChange={(e) =>
            setFormData((p) => ({ ...p, caption: e.target.value }))
          }
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
          value={formData.hashtags}
          onChange={(e) =>
            setFormData((p) => ({ ...p, hashtags: e.target.value }))
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          Séparez les hashtags par des espaces
        </p>
      </div>

      <MediaSection
        images={formData.images}
        onImagesChange={(images: { id: string; url: string }[]) =>
          setFormData((prev) => ({ ...prev, images: images }))
        }
        onDeleteImage={onDeleteImage}
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
