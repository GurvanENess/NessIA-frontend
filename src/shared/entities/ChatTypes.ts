import { PostData } from "./PostTypes";

export interface Message {
  id?: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  postData?: PostData;
}
