import { Pen, Image, Hash, Pencil } from "lucide-react";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const PostEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-screen font-commissioner max-w-[1024px] mx-auto"
    >
      <div className="p-5">
        <div className="flex border-b mb-5">
          <button className="pb-2 px-5 text-base cursor-pointer text-gray-600 relative">
            Aperçu
          </button>
          <button className="pb-2 px-5 text-base cursor-pointer text-purple-700 font-semibold relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-purple-700">
            Modifier
          </button>
        </div>

        <div className="rounded-lg p-0 ">
          <div className="flex items-center mb-4">
            <Image className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Image</h3>
          </div>
          <div className="border-2 bg-white border-gray-200 rounded-lg min-h-[200px] flex justify-center items-center relative overflow-hidden p-6">
            <div className="max-w-[400px] w-full h-full flex items-center justify-center">
              <img
                src={selectedImage || "/assets/default.jpg "}
                alt={selectedImage ? "Uploaded content" : "Placeholder"}
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
              className="absolute top-3 right-3 w-8 h-8 p-[7px] flex justify-center items-center cursor-pointer rounded-full shadow-lg bg-white hover:bg-gray-50 transition-colors"
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
            className="w-full p-2 border-2 border-gray-200 rounded-md text-base box-border resize-y min-h-[100px] bg-white"
            placeholder="Embrace summer vibes with our new collection! ☀️"
            rows={4}
            defaultValue="Embrace summer vibes with our new collection! ☀️"
          ></textarea>
        </div>

        <div className="rounded-lg py-0 mb-5">
          <div className="flex items-center mb-4">
            <Hash className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Hashtags</h3>
          </div>
          <input
            type="text"
            className="w-full p-2 border-2 border-gray-200 rounded-md text-base box-border mb-1 bg-white"
            placeholder="#summer #fashion #newcollection"
            defaultValue="#summer #fashion #newcollection"
          />
          <p className="text-xs text-gray-500">
            Séparez les hashtags par des espaces
          </p>
        </div>
      </div>
      <div className="border-t p-5 flex gap-3 justify-end border-gray-200">
        <button className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-white text-[#1A201B] border border-gray-300 hover:bg-gray-50">
          Sauvegarder
        </button>
        <button className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9]">
          Publier
        </button>
      </div>
    </motion.div>
  );
};

export default PostEditor;
