import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";

interface PostData {
  image: string | null;
  caption: string;
  hashtags: string;
}

const PostEditor: React.FC = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [postData, setPostData] = useState<PostData>({
    image: null,
    caption: "Embrace summer vibes with our new collection! ☀️",
    hashtags: "#summer #fashion #newcollection",
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving post:", postData);
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing post:", postData);
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
          <motion.button
            onClick={() => setIsPreviewMode(true)}
            className={`pb-2 px-5 text-base cursor-pointer relative ${
              isPreviewMode ? "text-purple-700 font-semibold" : "text-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aperçu
            {isPreviewMode && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setIsPreviewMode(false)}
            className={`pb-2 px-5 text-base cursor-pointer relative ${
              !isPreviewMode ? "text-purple-700 font-semibold" : "text-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Modifier
            {!isPreviewMode && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isPreviewMode ? "preview" : "form"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {isPreviewMode ? (
              <PostPreview postData={postData} />
            ) : (
              <PostForm postData={postData} setPostData={setPostData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t p-5 flex gap-3 justify-end border-gray-200">
        <motion.button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-white text-[#1A201B] border border-gray-300 hover:bg-gray-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sauvegarder
        </motion.button>
        <motion.button
          onClick={handlePublish}
          className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Publier
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PostEditor;
