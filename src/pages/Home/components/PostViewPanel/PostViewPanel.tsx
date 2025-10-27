import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  FacebookIcon,
  InstagramIcon,
  MessageSquare,
  Trash2,
} from "lucide-react";
import React, { useRef } from "react";
import DeletePostModal from "../../../../shared/components/DeletePostModal";
import PublishPostModal from "../../../../shared/components/PublishPostModal";
import { useApp } from "../../../../shared/contexts/AppContext";
import {
  getPlatformColor,
  getPlatformText,
  getStatusColor,
  getStatusText,
} from "../../../../shared/utils/postUtils";
import { usePostViewPanel } from "../../hooks/usePostViewPanel";
import EditTab from "./EditTab";
import PreviewTab from "./PreviewTab";
import ScheduleTab from "./ScheduleTab";

type PanelVariant = "overlay" | "inline";

const PostViewPanel: React.FC = () => {
  const { state } = useApp();
  const { postPanel } = state;
  const panelRef = useRef<HTMLDivElement>(null);
  // Utilisation du hook personnalisé pour toute la logique
  const {
    post,
    images,
    isLoading,
    error,
    activeTab,
    isDeleteModalOpen,
    isPublishModalOpen,
    setActiveTab,
    handleClose,
    handleOverlayClick,
    handleSave,
    handleSchedule,
    handleDeleteImage,
    handleImagesChange,
    handleDeletePost,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handlePublish,
    handleClosePublishModal,
    handlePublishConfirm,
  } = usePostViewPanel();

  const platformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon className="w-5 h-5 text-[#7C3AED] " />;
      case "facebook":
        return <FacebookIcon className="w-5 h-5 text-[#7C3AED] " />;
      default:
        return null;
    }
  };

  const renderPanelContent = (variant: PanelVariant) => (
    <>
      <div className="border-b bg-white">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="md:text-xl text-base font-semibold text-gray-900">
              {post?.status === "published"
                ? "Détails du post — Publié"
                : activeTab === "edit"
                ? "Modifier le post"
                : activeTab === "schedule"
                ? "Programmer le post"
                : "Détails du post"}
            </h2>
          </div>
          {variant === "overlay" && (
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] large:text-base text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Voir le chat</span>
            </button>
          )}
        </div>
        <div className="flex border-b">
          <motion.button
            onClick={() => setActiveTab("preview")}
            className={`pb-2 px-6 text-base cursor-pointer relative ${
              activeTab === "preview"
                ? "text-purple-700 font-semibold"
                : "text-gray-600"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Aperçu
            {activeTab === "preview" && (
              <motion.div
                layoutId="activeTabPanel"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("edit")}
            disabled={post?.status === "published"}
            className={`pb-2 px-6 text-base relative ${
              post?.status === "published"
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : activeTab === "edit"
                ? "text-purple-700 font-semibold cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            whileHover={post?.status !== "published" ? { scale: 1.02 } : {}}
            whileTap={post?.status !== "published" ? { scale: 0.98 } : {}}
            title={
              post?.status === "published"
                ? "Indisponible pour un post déjà publié"
                : ""
            }
          >
            Éditer
            {activeTab === "edit" && (
              <motion.div
                layoutId="activeTabPanel"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("schedule")}
            disabled={post?.status === "published"}
            className={`pb-2 px-6 text-base relative ${
              post?.status === "published"
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : activeTab === "schedule"
                ? "text-purple-700 font-semibold cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            whileHover={post?.status !== "published" ? { scale: 1.02 } : {}}
            whileTap={post?.status !== "published" ? { scale: 0.98 } : {}}
            title={
              post?.status === "published"
                ? "Indisponible pour un post déjà publié"
                : ""
            }
          >
            Programmer
            {activeTab === "schedule" && (
              <motion.div
                layoutId="activeTabPanel"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#E7E9F2] p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        ) : post ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {activeTab === "preview" && (
                <PreviewTab
                  post={post}
                  onEdit={() => setActiveTab("edit")}
                  onSchedule={() => setActiveTab("schedule")}
                />
              )}
              {activeTab === "edit" && (
                <EditTab
                  post={post}
                  images={images}
                  onImagesChange={handleImagesChange}
                  onDeleteImage={handleDeleteImage}
                  onSave={handleSave}
                  onCancel={() => setActiveTab("preview")}
                />
              )}
              {activeTab === "schedule" && (
                <ScheduleTab
                  post={post}
                  onSchedule={handleSchedule}
                  onCancel={() => setActiveTab("preview")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>

      {post && (
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between large:text-base text-sm md:text-sm">
          <div className="items-center gap-3 hidden lg:flex-row md:flex md:flex-col ">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                post.status
              )}`}
            >
              {getStatusText(post.status)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(
                post.platform
              )}`}
            >
              {getPlatformText(post.platform)}
            </span>
          </div>
          {post.status === "published" ? (
            <div className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-50 rounded-lg">
              {platformIcon(post.platform)}
              <span className="font-medium">Publié</span>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {platformIcon(post.platform)}
              <span>Publier maintenant</span>
            </button>
          )}
          <button
            onClick={handleOpenDeleteModal}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence>
        {postPanel.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              ref={panelRef}
              className="bg-white min-h-full max-h-full flex flex-col shadow-xl absolute top-0 right-0 md:left-[290px] left-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {renderPanelContent("overlay")}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(postPanel.postId || post) && (
        <div className="hidden lg:flex lg:flex-col lg:w-[420px] xl:w-[480px] h-full bg-white shadow-xl border-l border-gray-200">
          {renderPanelContent("inline")}
        </div>
      )}

      {post && (
        <DeletePostModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          postId={post.id}
          postTitle={post.title}
          onDeleteConfirm={handleDeletePost}
        />
      )}

      {post && (
        <PublishPostModal
          isOpen={isPublishModalOpen}
          onClose={handleClosePublishModal}
          postId={post.id}
          postTitle={post.title}
          platform={post.platform}
          onPublishConfirm={handlePublishConfirm}
        />
      )}
    </>
  );
};

export default PostViewPanel;
