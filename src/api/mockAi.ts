import { AIRequest, AIRequestFunction, AIResponse } from "../types/mockAITypes";
import axios from "axios";
const n8nUrl = import.meta.env.VITE_N8N_URL;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockAIClient {
  getResponse: AIRequestFunction = async (request: AIRequest): Promise<any> => {
    try {
      console.log(request);
      const response = await axios.post(n8nUrl, request);

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
