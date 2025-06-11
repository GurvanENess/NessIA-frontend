import { Pen, Image, Hash, Pencil } from "lucide-react";
import React, { useRef } from "react";
import { PostData } from "../../types/PostTypes";

interface PostFormProps {
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
}

const PostForm: React.FC<PostFormProps> = ({ postData, setPostData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostData((prev) => ({ ...prev, caption: event.target.value }));
  };

  const handleHashtagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostData((prev) => ({ ...prev, hashtags: event.target.value }));
  };

  return (
    <>
      <div className="rounded-lg p-0">
        <div className="flex items-center mb-4">
          <Image className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Image</h3>
        </div>
        <div className="border-2 bg-white border-gray-200 rounded-lg min-h-[200px] flex justify-center items-center relative overflow-hidden focus-within:border-purple-700 focus-within:ring-1 focus-within:ring-purple-700 transition-colors">
          <div className="max-w-[400px] w-full h-full flex items-center justify-center">
            <img
              src={postData.image || "/assets/default.jpg"}
              alt={postData.image ? "Uploaded content" : "Placeholder"}
              className="max-w-full max-h-[400px] w-auto h-auto object-contain"
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
            className="absolute top-3 right-3 w-8 h-8 p-[7px] flex justify-center items-center cursor-pointer rounded-full shadow-lg bg-white hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2"
          >
            <Pen className="w-full h-full text-gray-600" />
          </button>
        </div>
      </div>

      <div className="rounded-lg py-5">
        <div className="flex items-center mb-4">
          <Pencil className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Légende</h3>
        </div>
        <textarea
          className="w-full p-2 border-2 border-gray-200 rounded-md text-base box-border resize-y min-h-[100px] bg-white focus-visible:border-purple-700 focus-visible:ring-1 focus-visible:ring-purple-700 focus-visible:outline-none transition-colors"
          placeholder="Embrace summer vibes with our new collection! ☀️"
          rows={4}
          value={postData.caption}
          onChange={handleCaptionChange}
        />
      </div>

      <div className="rounded-lg py-0 mb-5">
        <div className="flex items-center mb-4">
          <Hash className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Hashtags</h3>
        </div>
        <input
          type="text"
          className="w-full p-2 border-2 border-gray-200 rounded-md text-base box-border mb-1 bg-white focus-visible:border-purple-700 focus-visible:ring-1 focus-visible:ring-purple-700 focus-visible:outline-none transition-colors"
          placeholder="#summer #fashion #newcollection"
          value={postData.hashtags}
          onChange={handleHashtagsChange}
        />
        <p className="text-xs text-gray-500">
          Séparez les hashtags par des espaces
        </p>
      </div>
    </>
  );
};

export default PostForm;
