import axios from "axios";
import { logger } from "../../../shared/utils/logger";

const n8nPublishUrl = import.meta.env.VITE_N8N_PUBLISH_URL;
const n8nHeaderAuth = import.meta.env.VITE_N8N_AUTH;

export class PublicationService {
  static async publishPost(
    postId: string,
    companyId: string,
    userToken: string,
    sessionId: string
  ) {
    try {
      console.log(
        "Publication",
        n8nPublishUrl,
        postId,
        companyId,
        userToken,
        sessionId
      );

      const response = await axios({
        method: "POST",
        url: n8nPublishUrl,
        data: {
          postId,
          companyId,
        },
        headers: {
          "x-user-auth": userToken,
          "x-user-session": sessionId,
          Authorization: n8nHeaderAuth,
        },
      });

      return response.data;
    } catch (error: any) {
      logger.error("Error publishing post", error);
      throw new Error("Failed to publish post: " + (error as Error).message);
    }
  }
}
