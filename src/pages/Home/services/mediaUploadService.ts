import {
  MediaUploadRequest,
  MediaUploadResponseItem,
  MediaWithUploadState,
} from "../entities/media";
import { AiClient } from "./AIClient";

const LOCAL_MEDIA_PREFIX = "local_";

const isImageFile = (file: File) => file.type.startsWith("image/");

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

export const filterImageFiles = (files: File[]): File[] =>
  files.filter(isImageFile);

export const createMediaFromFiles = async (
  files: File[]
): Promise<MediaWithUploadState[]> => {
  const imageFiles = filterImageFiles(files);

  const mediaItems = await Promise.all(
    imageFiles.map(async (file) => ({
      id: `${LOCAL_MEDIA_PREFIX}${crypto.randomUUID()}`,
      url: await readFileAsDataUrl(file),
      file,
      uploadState: "local" as const,
    }))
  );

  return mediaItems;
};

export const uploadMediaBatch = async ({
  medias,
  ...credentials
}: MediaUploadRequest): Promise<MediaUploadResponseItem[]> => {
  if (medias.length === 0) {
    return [];
  }

  const response = await AiClient.sendMedias({ medias, ...credentials });
  return response.uploads ?? [];
};

export const mergeUploadedMedia = (
  current: MediaWithUploadState[],
  uploaded: MediaUploadResponseItem[]
): MediaWithUploadState[] => {
  if (uploaded.length === 0) {
    return current;
  }

  const uploadedByTempId = new Map(uploaded.map((item) => [item.temp_id, item]));

  return current.map((media) => {
    const match = uploadedByTempId.get(media.id);
    if (!match) {
      return media;
    }

    return {
      id: match.id,
      url: match.url,
      uploadState: "uploaded" as const,
    };
  });
};

export const markMediaAsUploading = (
  current: MediaWithUploadState[],
  mediaIds: Set<string>
): MediaWithUploadState[] =>
  current.map((media) =>
    mediaIds.has(media.id)
      ? { ...media, uploadState: "uploading" as const }
      : media
  );

export const markMediaAsError = (
  current: MediaWithUploadState[],
  mediaIds: Set<string>
): MediaWithUploadState[] =>
  current.map((media) =>
    mediaIds.has(media.id)
      ? { ...media, uploadState: "error" as const }
      : media
  );

export const getPendingMedia = (
  medias: MediaWithUploadState[]
): MediaWithUploadState[] =>
  medias.filter((media) => media.uploadState !== "uploaded" && Boolean(media.file));

