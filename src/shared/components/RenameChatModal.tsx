import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit } from "lucide-react";
import { db } from "../services/db";
import toast from "react-hot-toast";
import { useApp } from "../contexts/AppContext";

interface RenameChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentTitle: string;
  onRenameConfirm: (newTitle: string) => void;
}

const RenameChatModal: React.FC<RenameChatModalProps> = ({
  isOpen,
  onClose,
  chatId,
  currentTitle,
  onRenameConfirm,
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state } = useApp();

  // Reset title when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle);
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 200);
    }
  }, [isOpen, currentTitle]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim()) {
      toast.error("Le titre ne peut pas être vide");
      return;
    }

    if (newTitle.trim() === currentTitle) {
      onClose();
      return;
    }

    setIsLoading(true);
    
    try {
      await db.renameChatById(
        chatId,
        newTitle.trim(),
        state.currentCompany?.id as string
      );
      onRenameConfirm(newTitle.trim());
      toast.success("Conversation renommée avec succès");
      onClose();
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Erreur lors du renommage de la conversation");
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
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Edit className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Renommer la conversation
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
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre de la conversation"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-2">
                {newTitle.length}/100 caractères
              </p>
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
                type="submit"
                disabled={isLoading || !newTitle.trim()}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RenameChatModal;