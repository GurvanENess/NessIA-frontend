import { AnimatePresence, motion } from "framer-motion";
import { Eye, MessageSquare, Trash2 } from "lucide-react";
import React, { useRef } from "react";
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

const PostViewPanel: React.FC = () => {
  const { state } = useApp();
  const { postPanel } = state;
  const panelRef = useRef<HTMLDivElement>(null);

  // Utilisation du hook personnalisé pour toute la logique
  const {
    post,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    handleClose,
    handleOverlayClick,
    handleSave,
    handleSchedule,
    handleDeleteImage,
  } = usePostViewPanel();

  return (
    <AnimatePresence>
      {postPanel.isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
            <div className="border-b bg-white">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-[#7C3AED]" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === "edit"
                      ? "Modifier le post"
                      : activeTab === "schedule"
                      ? "Programmer le post"
                      : "Détails du post"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Voir le chat</span>
                </button>
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
                  className={`pb-2 px-6 text-base cursor-pointer relative ${
                    activeTab === "edit"
                      ? "text-purple-700 font-semibold"
                      : "text-gray-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                  className={`pb-2 px-6 text-base cursor-pointer relative ${
                    activeTab === "schedule"
                      ? "text-purple-700 font-semibold"
                      : "text-gray-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                        onDeleteImage={handleDeleteImage}
                        onSave={handleSave}
                        onCancel={() => setActiveTab("preview")}
                      />
                    )}
                    {activeTab === "schedule" && (
                      <ScheduleTab
                        onSchedule={handleSchedule}
                        onCancel={() => setActiveTab("preview")}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>

            {post && (
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostViewPanel;
