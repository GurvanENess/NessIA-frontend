import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useApp } from "../../shared/contexts/AppContext";
import { useCompanyResourceAccess } from "../../shared/hooks/useCompanyResourceAccess";
import { db } from "../../shared/services/db";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";
import { formatPostToDb, getHashtags } from "./utils/utils";

const PostEditor: React.FC = () => {
  const { state, dispatch } = useApp();
  const { postId } = useParams<{ postId: string }>();
  const { isPreviewMode, postData, isSaving, isPublishing } = state.post;

  // Vérifier l'accès au post par compagnie
  const { hasAccess, isLoading, resourceData, error } =
    useCompanyResourceAccess("post");

  // Charger les données du post si on a accès
  useEffect(() => {
    if (postId && hasAccess && resourceData) {
      dispatch({
        type: "UPDATE_POST_DATA",
        payload: {
          image: resourceData.media?.[0]?.url || "",
          caption: resourceData.content_text,
          hashtags: getHashtags(resourceData.hashtags || ""),
        },
      });
    }
  }, [postId, hasAccess, resourceData, dispatch]);

  // Si en cours de vérification, afficher un indicateur
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'accès au post...</p>
        </div>
      </div>
    );
  }

  // Si pas d'accès, le hook redirigera automatiquement vers 404
  if (!hasAccess) {
    return null;
  }

  const handleSave = async () => {
    if (!postId || !state.currentCompany?.id) return;

    dispatch({ type: "SAVE_POST_START" });
    try {
      const formatedPost = formatPostToDb(postData);
      await db.updatePostById(postId, formatedPost, state.currentCompany.id);

      dispatch({ type: "SAVE_POST_SUCCESS" });
      toast.success("Post sauvegardé avec succès");
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
