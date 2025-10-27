import { PostData } from "../../../shared/entities/PostTypes";
import { MediaWithUploadState } from "./media";

export interface AIRequest {
  message: string;
  sessionId?: string | null;
  userToken?: string;
  companyId: string;
  medias?: MediaWithUploadState[];
}

export interface AIResponse {
  message: string;
  sessionId: string;
  post?: PostData;
}

export interface AIRequestFunction {
  (request: AIRequest): Promise<AIResponse>;
}
