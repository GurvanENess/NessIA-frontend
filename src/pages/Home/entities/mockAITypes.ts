import { PostData } from "../../../shared/entities/PostTypes";

export interface AIRequest {
  message: string;
  sessionId?: string;
}

export interface AIResponse {
  message: string;
  availableActions: Action[];
  post?: PostData;
}

export interface Action {
  label: string;
  type: "primary" | "secondary";
  request: AIRequest;
}

export interface AIRequestFunction {
  (request: AIRequest): Promise<AIResponse>;
}
