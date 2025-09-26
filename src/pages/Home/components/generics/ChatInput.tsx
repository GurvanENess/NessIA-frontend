import { Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef } from "react";
import ImagePreview from "../../../../shared/components/ImagePreview";
import { useApp } from "../../../../shared/contexts/AppContext";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import { Job } from "../../../../shared/entities/JobTypes";
import { MediaWithUploadState } from "../../entities/media";
import { useSimpleImageUpload } from "../../hooks/useImageUpload";
import JobStatus from "./JobStatus";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (
    messageToSend: string,
    hideUserMessage: boolean,
    images?: MediaWithUploadState[]
  ) => void;
  handleSuggestionClick: (job: unknown, answer: string) => Promise<void>;
  isLoading: boolean;
  jobs?: Job[];
  children?: React.ReactNode;
  sessionId?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  handleSuggestionClick,
  isLoading,
  children,
  jobs = [],
  sessionId,
}) => {
  const { user } = useAuth();
  const { state } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { images, addImages, removeImage, uploadError, setImages } =
    useSimpleImageUpload(
      sessionId,
      user?.token,
      state.currentCompany?.id || "1"
    );

  useEffect(() => {
    console.log("💡 Jobs received in ChatInput:", jobs);
    console.log("💡 Jobs length in ChatInput:", jobs.length);
  }, [jobs]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        onChange(value);
      } else {
        e.preventDefault();
        onSend(value, false);
      }
    }
  };

  const hasActiveJobs = jobs.some(
    (job) => job.status === "running" || job.status === "waiting_user"
  );

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await addImages(files);
    }

    // Reset input file pour permettre de sélectionner les mêmes fichiers
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = (imageId: string) => {
    removeImage(imageId);
  };

  return (
    <>
      {/* Affichage du statut des jobs */}
      <JobStatus jobs={jobs} onSuggestionClick={handleSuggestionClick} />

      <div className="sticky bottom-0 left-0 right-0 md:pb-8 md:px-2 z-[50]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend(value, false, images);
            // Effacer les images après l'envoi
            setImages([]);
          }}
          className="sm:max-w-full md:max-w-2xl mx-auto"
        >
          <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
            {children}
          </div>

          <div className="shadow relative w-full md:mx-auto bg-white md:rounded-2xl border border-gray-300 transition-colors">
            {/* Section d'affichage des images uploadées */}
            {images.length > 0 && (
              <div className="px-4 pt-4 pb-2 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <ImagePreview
                        src={image.url}
                        alt={`Image uploadée`}
                        size="sm"
                        showDeleteButton={true}
                        onDelete={() => handleDeleteImage(image.id)}
                        disableModal={false}
                        className="rounded-lg"
                      />
                      {/* Indicateur de statut d'upload */}
                      {image.uploadState === "uploading" && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {image.uploadState === "error" && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            !
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {uploadError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasActiveJobs
                  ? "Répondez à NessIA ou attendez la fin du traitement..."
                  : "Discuter avec NessIA"
              }
              rows={1}
              disabled={isLoading || hasActiveJobs}
              className="resize-none w-full px-4 pt-4 pb-2 rounded-2xl bg-transparent focus:outline-none max-h-[200px] overflow-y-auto whitespace-pre-wrap disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: "56px" }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={isLoading || hasActiveJobs}
                className="group hover:bg-gray-50 rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Paperclip className="w-5 h-5 text-[#7C3AED] group-hover:text-[#6D28D9] transition-colors" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
              />
              <button
                type="submit"
                disabled={
                  isLoading ||
                  hasActiveJobs ||
                  !value.trim() ||
                  images.some((img) => img.uploadState === "uploading")
                }
                className="bg-[#7C3AED] text-white p-[5px] rounded-md hover:bg-[#6D28D9] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7C3AED]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
