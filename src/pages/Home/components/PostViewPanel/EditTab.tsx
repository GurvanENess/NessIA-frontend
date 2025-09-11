import { Hash, Image as ImageIcon, Pen, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { PostData } from "../../../../shared/entities/PostTypes";
import { Post } from "../../../Posts/entities/PostTypes";

interface EditTabProps {
  post: Post;
  onSave: (data: PostData) => Promise<void>;
  onCancel: () => void;
}

const EditTab: React.FC<EditTabProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PostData>({
    image: post.imageUrl || "",
    caption: post.description,
    hashtags: (post.hashtags || []).join(" "),
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      image: post.imageUrl || "",
      caption: post.description,
      hashtags: (post.hashtags || []).join(" "),
    });
  }, [post]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((p) => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      image: post.imageUrl || "",
      caption: post.description,
      hashtags: (post.hashtags || []).join(" "),
    });
    onCancel();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg">
        <div className="flex items-center mb-4">
          <ImageIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Image</h3>
        </div>
        <div className="border-2 bg-white border-gray-200 rounded-lg min-h-[200px] flex justify-center items-center relative overflow-hidden">
          <div className="max-w-[400px] w-full h-full flex items-center justify-center">
            <img
              src={formData.image || "/assets/default.jpg"}
              alt={formData.image ? "Uploaded content" : "Placeholder"}
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={handleImageClick}
            className="absolute top-3 right-3 w-8 h-8 p-[7px] flex justify-center items-center rounded-full shadow-lg bg-white hover:bg-gray-50"
          >
            <Pen className="w-full h-full text-gray-600" />
          </button>
        </div>
      </div>

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
          placeholder="#marketing #socialmedia"
          value={formData.hashtags}
          onChange={(e) =>
            setFormData((p) => ({ ...p, hashtags: e.target.value }))
          }
        />
      </div>

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
