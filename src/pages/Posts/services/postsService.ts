import { db } from "../../../shared/services/db";
import { Post } from "../entities/PostTypes";

const mapPost = (data: any): Post => {
  return {
    id: data.id,
    title: data.title,
    description: data.content_text || "Pas de contenu.",
    status: data.status,
    platform: data.platform?.name || "Instagram",
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
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
