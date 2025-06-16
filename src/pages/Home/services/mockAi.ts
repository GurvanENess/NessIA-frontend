import {
  AIRequest,
  AIRequestFunction,
  AIResponse,
} from "../entities/mockAITypes";
import axios from "axios";
const n8nUrl = import.meta.env.VITE_N8N_URL_PROD;

class MockAIClient {
  getResponse: AIRequestFunction = async (
    request: AIRequest
  ): Promise<AIResponse> => {
    try {
      console.log(request);
      const response = await axios.post(n8nUrl, request);

      console.log(response);
      const data = response.data;
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

export const mockAiClient = new MockAIClient();
