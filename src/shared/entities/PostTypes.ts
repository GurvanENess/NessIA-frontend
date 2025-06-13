export interface PostData {
  image: string;
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
