export type MediaUploadState = 'local' | 'uploading' | 'uploaded' | 'error';

export interface MediaWithUploadState {
  id: string;
  url: string;
  file?: File;
  uploadState: MediaUploadState;
}

export interface MediaUploadRequest {
  sessionId: string;
  userToken: string;
  companyId: string;
  medias: MediaWithUploadState[];
}

export interface MediaUploadResponseItem {
  id: string;
  url: string;
  temp_id: string;
}

export interface MediaUploadResponse {
  uploads: MediaUploadResponseItem[];
}
