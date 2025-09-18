import { Post } from "../../pages/Posts/entities/PostTypes";

export interface SupabasePost {
  id: string;
  title: string;
  content_text: string;
  hashtags: string | null;
  created_at: string;
  status: string;
  platform: { name: string }[] | { name: string } | null;
  session: { id: string; media: { url: string; created_at: Date }[] };
}

export const convertSupabasePost = (supabasePost: SupabasePost): Post => {
  const platformName = Array.isArray(supabasePost.platform)
    ? supabasePost.platform[0]?.name
    : supabasePost.platform?.name;

  const sessionId = Array.isArray(supabasePost.session)
    ? supabasePost.session[0]?.id
    : supabasePost.session?.id;

  // Récupération des URLs des images depuis la session.images, triées par date de création
  const imageUrls =
    Array.isArray(supabasePost.session?.media) &&
    supabasePost.session.media.length > 0
      ? supabasePost.session.media
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .map((image) => image.url)
      : [];

  let hashtags: string[] = [];
  try {
    hashtags = JSON.parse(supabasePost.hashtags || "[]");
  } catch (e) {
    console.error(e);
    hashtags = [];
  }

  return {
    id: supabasePost.id,
    title: supabasePost.title,
    description: supabasePost.content_text,
    status: supabasePost.status as Post["status"],
    platform: (platformName as Post["platform"]) || "instagram",
    createdAt: new Date(supabasePost.created_at),
    imageUrls,
    hashtags,
    userId: "",
    conversationId: sessionId,
  };
};

export const getStatusColor = (status: Post["status"]): string => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 border-green-200";
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusText = (status: Post["status"]): string => {
  switch (status) {
    case "published":
      return "Publié";
    case "scheduled":
      return "Programmé";
    case "draft":
      return "Brouillon";
    default:
      return status;
  }
};

export const getPlatformColor = (platform: Post["platform"]): string => {
  switch (platform) {
    case "instagram":
      return "bg-pink-100 text-pink-800";
    case "facebook":
      return "bg-blue-100 text-blue-800";
    case "tiktok":
      return "bg-black text-white";
    case "twitter":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPlatformText = (platform: Post["platform"]): string => {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "tiktok":
      return "TikTok";
    case "twitter":
      return "Twitter";
    default:
      return platform;
  }
};
