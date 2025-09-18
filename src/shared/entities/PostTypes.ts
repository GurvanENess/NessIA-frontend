export interface PostData {
  images: { id: string; url: string }[];
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
