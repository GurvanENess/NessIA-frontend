import { PostData } from "../../../shared/entities/PostTypes";

export interface AIRequest {
  message: string;
  sessionId?: string | null;
  userToken?: string;
  companyId: string;
}

export interface AIResponse {
  message: string;
  sessionId: string;
  post?: PostData;
}

export interface AIRequestFunction {
  (request: AIRequest): Promise<AIResponse>;
}
