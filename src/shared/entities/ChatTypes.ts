import { PostData } from "./PostTypes";

export interface MessageMedia {
  id: string;
  url: string;
}

export interface Message {
  id?: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  postData?: PostData;
  media?: MessageMedia[];
}
