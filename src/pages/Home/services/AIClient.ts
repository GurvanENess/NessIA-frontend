import { AIRequest, AIRequestFunction, AIResponse } from "../entities/AITypes";
import axios from "axios";
const n8nUrl = import.meta.env.VITE_N8N_URL_PROD; // Use the production URL for n8n

class AIClient {
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
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };
}

function isAIResponse(data: any): data is AIResponse {
  return "message" in data && "availableActions" in data;
}

export const AiClient = new AIClient();
