import { Media } from "./MediaTypes";

export interface PostData {
  images: Media[];
  caption: string;
  hashtags: string;
}

export interface InstagramPostProps extends PostData {
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  className?: string;
}
