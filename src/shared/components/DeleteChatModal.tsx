import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { db } from "../services/db";
import toast from "react-hot-toast";
import { useApp } from "../contexts/AppContext";

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  chatTitle: string;
  onDeleteConfirm: () => void;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  isOpen,
  onClose,
  chatId,
  chatTitle,
  onDeleteConfirm,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { state } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleDelete = async () => {
    setIsLoading(true);
    
    try {
      await db.deleteChatById(chatId, state.currentCompany?.id as string);
      onDeleteConfirm();
      toast.success("Conversation supprimée avec succès");
      onClose();
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Supprimer la conversation
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-2">
                  Êtes-vous sûr de vouloir supprimer cette conversation ?
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">"{chatTitle}"</span>
                </p>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible. Tous les messages de cette conversation seront définitivement supprimés.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DeleteChatModal;