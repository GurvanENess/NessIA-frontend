import { Post } from "../entities/PostTypes";
import { db } from "../../../shared/services/db";

const mapPost = (data: any): Post => {
  return {
    id: data.id,
    title: data.title,
    description: data.content_text || "Pas de contenu.",
    status: data.status,
    platform: data.platform?.name || "Instagram",
    associatedChatId: data.associated_chat_id,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    publishedAt: data.published_at ? new Date(data.published_at) : undefined,
    imageUrl: data.image_url,
    userId: data.user_id,
  };
};

export class PostsService {
  static async fetchUserPosts(): Promise<Post[]> {
    // Simulate API call delay
    const posts = await db.getAllPosts();
    const mappedPosts = posts.map(mapPost);

    // For demo purposes, always return mock data regardless of userId
    // In real app, this would filter by actual userId
    return mappedPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}
