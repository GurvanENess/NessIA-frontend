export interface PostData {
  image: string | null;
  caption: string;
  hashtags: string;
}

export interface InstagramPostProps extends PostData {
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
}
