import axios from "axios";
import { db } from "../../../shared/services/db";

const n8nAuthUrl = import.meta.env.VITE_N8N_OAUTH_URL;
const n8nHeaderAuth = import.meta.env.VITE_N8N_AUTH;

export class PlatformsService {
  static async getConnectionUrl(
    companyId: string,
    userToken: string
  ): Promise<string> {
    const response = await axios.post(
      n8nAuthUrl,
      {
        companyId: companyId,
      },
      {
        headers: {
          Authorization: n8nHeaderAuth,
          "x-user-auth": userToken,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to get connection URL");
    }

    return response.data.authorizeUrl;
  }

  static async getConnectedPlatforms(companyId: string) {
    const data = await db.getConnectedPlatforms(companyId);
    return data;
  }
}
