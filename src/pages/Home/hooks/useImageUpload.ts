import { useCallback, useState } from "react";
import { MediaWithUploadState } from "../entities/media";
import {
  createMediaFromFiles,
  getPendingMedia,
  markMediaAsError,
  markMediaAsUploading,
  mergeUploadedMedia,
  uploadMediaBatch,
} from "../services/mediaUploadService";

interface UseImageUploadParams {
  sessionId?: string;
  userToken?: string;
  companyId?: string;
  onImagesChange?: (images: MediaWithUploadState[]) => void;
  onError?: (error: unknown) => void;
}

interface UseImageUploadReturn {
  uploadImages: (images: MediaWithUploadState[]) => Promise<void>;
  addFilesToUpload: (
    files: FileList | File[],
    currentImages: MediaWithUploadState[]
  ) => Promise<void>;
  uploadError: string | null;
}

const toFileArray = (files: FileList | File[]): File[] =>
  Array.isArray(files) ? files : Array.from(files);

const missingCredentialsMessage =
  "Missing upload parameters (sessionId, userToken, companyId)";

export const useImageUpload = ({
  sessionId,
  userToken,
  companyId,
  onImagesChange,
  onError,
}: UseImageUploadParams): UseImageUploadReturn => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const emitImages = useCallback(
    (images: MediaWithUploadState[]) => {
      onImagesChange?.(images);
    },
    [onImagesChange]
  );

  const emitError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      const message = error instanceof Error ? error.message : fallbackMessage;
      setUploadError(message);
      if (onError) {
        onError(error instanceof Error ? error : new Error(message));
      }
    },
    [onError]
  );

  const uploadImages = useCallback(
    async (targetImages: MediaWithUploadState[]) => {
      const pending = getPendingMedia(targetImages);

      if (pending.length === 0) {
        return;
      }

      const pendingIds = new Set(pending.map((media) => media.id));

      if (!sessionId || !userToken || !companyId) {
        const errored = markMediaAsError(targetImages, pendingIds);
        emitImages(errored);
        emitError(
          new Error(missingCredentialsMessage),
          missingCredentialsMessage
        );
        return;
      }

      setUploadError(null);

      const uploadingSnapshot = markMediaAsUploading(targetImages, pendingIds);
      emitImages(uploadingSnapshot);

      try {
        const uploaded = await uploadMediaBatch({
          sessionId,
          userToken,
          companyId,
          medias: pending,
        });

        const merged = mergeUploadedMedia(uploadingSnapshot, uploaded);
        emitImages(merged);
      } catch (error) {
        const errored = markMediaAsError(uploadingSnapshot, pendingIds);
        emitImages(errored);
        emitError(error, "Image upload failed");
      }
    },
    [sessionId, userToken, companyId, emitError, emitImages]
  );

  const addFilesToUpload = useCallback(
    async (files: FileList | File[], currentImages: MediaWithUploadState[]) => {
      const fileArray = toFileArray(files);
      if (fileArray.length === 0) {
        return;
      }

      try {
        const newMediaItems = await createMediaFromFiles(fileArray);

        if (newMediaItems.length === 0) {
          emitError(
            new Error("Only image files are supported"),
            "Only image files are supported"
          );
          return;
        }

        const nextImages = [...currentImages, ...newMediaItems];
        emitImages(nextImages);
        await uploadImages(nextImages);
      } catch (error) {
        emitError(error, "Unable to prepare images");
      }
    },
    [emitError, emitImages, uploadImages]
  );

  return {
    uploadImages,
    addFilesToUpload,
    uploadError,
  };
};

export const useSimpleImageUpload = (
  sessionId?: string,
  userToken?: string,
  companyId?: string
) => {
  const [images, setImages] = useState<MediaWithUploadState[]>([]);

  const { addFilesToUpload, uploadImages, uploadError } = useImageUpload({
    sessionId,
    userToken,
    companyId,
    onImagesChange: setImages,
    onError: (error) => console.error("Upload error", error),
  });

  const addImages = useCallback(
    async (newFiles: File[] | FileList) => {
      await addFilesToUpload(newFiles, images);
    },
    [addFilesToUpload, images]
  );

  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  return {
    images,
    addImages,
    removeImage,
    uploadImages,
    uploadError,
    setImages,
  } as const;
};
