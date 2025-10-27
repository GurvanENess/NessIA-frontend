import { Media, MediaWithPosition } from "./MediaTypes";

export interface PostData {
  images: Media[];
  caption: string;
  hashtags: string;
  imagePositions?: MediaWithPosition[]; // Positions des images pour la persistance
}

export interface InstagramPostProps extends PostData {
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  className?: string;
}
