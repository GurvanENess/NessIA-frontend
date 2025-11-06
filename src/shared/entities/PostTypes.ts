import { Media, MediaWithPosition } from "./MediaTypes";

export type PostPlatform = "instagram" | "facebook" | "tiktok" | "twitter";

export interface PostData {
  images: Media[];
  caption: string;
  hashtags: string;
  imagePositions?: MediaWithPosition[]; // Positions des images pour la persistance
  platform: PostPlatform;
  platformId: number | null;
}

export interface InstagramPostProps extends PostData {
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  className?: string;
}
