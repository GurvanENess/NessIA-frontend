import { BasePostData } from "./BaseTypes";

export interface PostData extends BasePostData {}

export interface InstagramPostProps extends BasePostData {
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  className?: string;
}
