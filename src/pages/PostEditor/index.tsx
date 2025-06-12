import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";
import { useApp } from "../../contexts/AppContext";

const PostEditor: React.FC = () => {
  const { state, dispatch } = useApp();
  const { isPreviewMode, postData, isSaving, isPublishing, error } = state.post;

  const handleSave = async () => {
    dispatch({ type: "SAVE_POST_START" });
    try {
      // TODO: Implement save functionality
      console.log("Saving post:", postData);
      dispatch({ type: "SAVE_POST_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SAVE_POST_ERROR",
        payload: err instanceof Error ? err.message : "Failed to save post",
      });
    }
  };

  const handlePublish = async () => {
    dispatch({ type: "PUBLISH_POST_START" });
    try {
      // TODO: Implement publish functionality
      console.log("Publishing post:", postData);
      dispatch({ type: "PUBLISH_POST_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "PUBLISH_POST_ERROR",
        payload: err instanceof Error ? err.message : "Failed to publish post",
      });
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
          <motion.button
            onClick={() =>
              dispatch({ type: "SET_PREVIEW_MODE", payload: true })
            }
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
            onClick={() =>
              dispatch({ type: "SET_PREVIEW_MODE", payload: false })
            }
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
              <PostForm
                postData={postData}
                setPostData={(data) =>
                  dispatch({ type: "UPDATE_POST_DATA", payload: data })
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t p-5 flex gap-3 justify-end border-gray-200">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-white text-[#1A201B] border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </motion.button>
        <motion.button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isPublishing ? "Publication..." : "Publier"}
        </motion.button>
      </div>
      {error && (
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg mx-5 mb-5">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default PostEditor;
