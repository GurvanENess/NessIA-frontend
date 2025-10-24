import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Mail, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface ConfirmEmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  newEmail: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmEmailChangeModal: React.FC<ConfirmEmailChangeModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  newEmail,
  onConfirm,
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Changer d'adresse email
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
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-3">
                  Confirmez-vous le changement d'adresse email ?
                </p>
                <div className="text-sm text-gray-600 mb-2 space-y-1">
                  <p>
                    <span className="font-medium">Email actuel :</span>{" "}
                    <span className="text-gray-900">{currentEmail}</span>
                  </p>
                  <p>
                    <span className="font-medium">Nouvel email :</span>{" "}
                    <span className="text-gray-900">{newEmail}</span>
                  </p>
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Important :</span> Un email
                    de confirmation sera envoyé à{" "}
                    <span className="font-medium">{newEmail}</span>. Les
                    changements ne prendront effet que lorsque vous aurez
                    confirmé votre nouvelle adresse en cliquant sur le lien dans
                    l'email.
                  </p>
                </div>
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
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Confirmer"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ConfirmEmailChangeModal;
