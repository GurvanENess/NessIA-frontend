import { PostData } from "../../../shared/entities/PostTypes";

export interface AIRequest {
  message: string;
  sessionId?: string;
  userToken?: string;
  companyId: string;
}

export interface AIResponse {
  message: string;
  action: Action;
  sessionId: string;
  post?: PostData;
}

export interface Action {
  type: string;
  responses: string[];
  blocking: boolean;
}

export interface AIRequestFunction {
  (request: AIRequest): Promise<AIResponse>;
}
