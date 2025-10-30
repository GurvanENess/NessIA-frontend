import { db } from "../../../shared/services/db";
import { Post } from "../entities/PostTypes";
import { normalizePlatformName } from "../../../shared/utils/postUtils";

const mapPost = (data: any): Post => {
  const platformRelation = Array.isArray(data.platform)
    ? data.platform[0]
    : data.platform;
  const platformName = platformRelation?.name ?? data.platform_name ?? null;
  const platformIdRaw =
    platformRelation?.id ?? data.platform_id ?? data.platform?.id;
  const parsedPlatformId = Number(platformIdRaw);
  const platformId =
    typeof platformIdRaw === "number"
      ? platformIdRaw
      : Number.isFinite(parsedPlatformId)
      ? parsedPlatformId
      : null;

  return {
    id: data.id,
    title: data.title,
    description: data.content_text || "Pas de contenu.",
    status: data.status,
    platform: normalizePlatformName(platformName),
    platformId,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    scheduledAt: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    publishedAt: data.published_at ? new Date(data.published_at) : undefined,
    images: data.session?.media || [],
    userId: data.user_id,
    conversationId: data.session?.id || "",
  };
};

export class PostsService {
  static async fetchUserPosts(companyId: string): Promise<Post[]> {
    // Simulate API call delay
    const posts = await db.getAllPosts(companyId);
    const mappedPosts = posts.map(mapPost);

    // For demo purposes, always return mock data regardless of userId
    // In real app, this would filter by actual userId
    return mappedPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}
