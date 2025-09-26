import axios from "axios";
import { logger } from "../../../shared/utils/logger";
import { AIRequest, AIRequestFunction, AIResponse } from "../entities/AITypes";
import {
  MediaUploadRequest,
  MediaUploadResponse,
} from "../entities/media";

const n8nUrl = import.meta.env.VITE_N8N_URL_PROD;
const n8nMediasUrl = import.meta.env.VITE_N8N_URL_MEDIA;
const n8nJobsInputUrl = import.meta.env.VITE_N8N_URL_JOBS_USERINPUT;

class AIClient {
  sendMedias = async ({
    sessionId,
    userToken,
    medias,
    companyId,
  }: MediaUploadRequest): Promise<MediaUploadResponse> => {
    const data = new FormData();
    data.append("companyId", companyId);

    medias.forEach((media) => {
      if (media.file) {
        data.append(media.id, media.file);
      }
    });

    const options = {
      method: "POST",
      url: n8nMediasUrl,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: import.meta.env.VITE_N8N_AUTH,
        "x-user-auth": userToken,
        "x-user-session": sessionId,
      },
      data,
    };

    const response = await axios.request<MediaUploadResponse>(options);
    return response.data;
  };

  sendAnswerToSuggestion = async ({
    sessionId,
    userToken,
    userInput,
    jobId,
    agentIndex,
    companyId,
  }: {
    sessionId: string;
    userToken: string;
    userInput: string;
    jobId: string;
    agentIndex: number;
    companyId: string;
  }): Promise<unknown> => {
    const options = {
      method: "PATCH",
      url: n8nJobsInputUrl,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: import.meta.env.VITE_N8N_AUTH,
        "x-user-auth": userToken,
        "x-user-session": sessionId,
      },
      data: {
        userInput,
        jobId,
        agentIndex,
        companyId,
      },
    };

    const response = await axios.request(options);
    return response;
  };

  getResponse: AIRequestFunction = async (
    request: AIRequest
  ): Promise<AIResponse> => {
    const { sessionId, userToken } = request;

    const headers: Record<string, string | undefined> = {
      "Content-Type": "multipart/form-data",
      Authorization: import.meta.env.VITE_N8N_AUTH,
      "x-user-auth": userToken,
    };
    if (sessionId) {
      headers["x-user-session"] = sessionId;
    } else {
      headers["x-user-session"] = "";
    }

    const options = {
      method: "POST",
      url: n8nUrl,
      headers,
      data: request,
    };

    try {
      const response = await axios.request(options);
      const headersSessionId = response.headers["x-user-session"];

      const data = {
        ...response.data,
        sessionId: sessionId || headersSessionId,
      };

      return data;
    } catch (error) {
      logger.error("Error fetching AI response", error);
      throw error;
    }
  };
}

function isAIResponse(data: any): data is AIResponse {
  return "message" in data;
}

export const AiClient = new AIClient();





