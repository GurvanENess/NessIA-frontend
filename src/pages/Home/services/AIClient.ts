import { AIRequest, AIRequestFunction, AIResponse } from "../entities/AITypes";
import axios from "axios";
const n8nUrl = import.meta.env.VITE_N8N_URL_PROD; // Use the production URL for n8n

class AIClient {
  getResponse: AIRequestFunction = async (
    request: AIRequest
  ): Promise<AIResponse> => {
    const { sessionId, userToken } = request;

    const options = {
      method: "POST",
      url: n8nUrl,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: import.meta.env.VITE_N8N_AUTH,
        "User-Auth": userToken,
        "x-user-session": sessionId,
      },
      data: request,
    };

    try {
      console.log(request);
      const response = await axios.request(options);
      const headersSessionId = response.headers["x-user-session"];

      const data = {
        ...response.data,
        sessionId: sessionId || headersSessionId,
      };
      console.log("Response data:", data);
      console.log("Is AIResponse:", isAIResponse(data));
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
