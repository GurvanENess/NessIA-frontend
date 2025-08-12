import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";
import { useApp } from "../../shared/contexts/AppContext";
import { useParams } from "react-router-dom";
import { db } from "../../shared/services/db";
import { getHashtags, formatPostToDb } from "./utils/utils";
import { toast } from "react-hot-toast";
import { wait } from "../../shared/utils/utils";

const PostEditor: React.FC = () => {
  const { state, dispatch } = useApp();
  const { postId } = useParams<{ postId: string }>();
  const { isPreviewMode, postData, isSaving, isPublishing } = state.post;

  if (postId) {
    useEffect(() => {
      // Fetch post data by ID when postId is available
      const fetchPostData = async () => {
        try {
          const data = await db.getPostById(
            postId,
            state.currentCompany?.id as string
          );
          console.log(data);

          dispatch({
            type: "UPDATE_POST_DATA",
            payload: {
              image: data.media?.[0]?.url || "", // HARDCODED FOR TESTS
              caption: data.content_text,
              hashtags: getHashtags(data.hashtags || ""),
            },
          });
        } catch (err) {
          console.error("Error fetching post content:", err);
        }
      };
      fetchPostData();
    }, [postId]);
  }

  const handleSave = async () => {
    dispatch({ type: "SAVE_POST_START" });
    try {
      const formatedPost = formatPostToDb(postData);
      console.log(formatedPost);
      await db.updatePostById(
        postId!,
        formatedPost,
        state.currentCompany?.id as string
      );

      dispatch({ type: "SAVE_POST_SUCCESS" });
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde du post");
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
      alert("Pif, paf, pouf... Publié ! (non)");

      dispatch({ type: "PUBLISH_POST_SUCCESS" });
    } catch (err) {
      toast.error("Erreur lors de la publication du post");
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
      className="flex flex-col font-commissioner max-w-[1024px] mx-auto"
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
    </motion.div>
  );
};

export default PostEditor;
