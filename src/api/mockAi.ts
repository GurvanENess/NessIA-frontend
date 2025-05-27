import { AIRequest, AIRequestFunction, AIResponse } from "../types/mockAITypes";
import axios from "axios";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockAIClient {
  getResponse: AIRequestFunction = async (request: AIRequest): Promise<any> => {
    try {
      console.log(request);
      const response = await axios.post(
        "https://n8n.eness.fr/webhook/b12a4839-8863-408d-b317-ac809ca37221",
        request
      );

      console.log(response);
      const data = response.data;
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };
}

export const mockAiClient = new MockAIClient();
