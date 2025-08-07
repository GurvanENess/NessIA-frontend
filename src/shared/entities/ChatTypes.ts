import { Action } from "../../pages/Home/entities/AITypes";
import { PostData } from "./PostTypes";

export interface Message {
  id?: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
  action?: Action;
  handleAction?: (label: string) => void;
  postData?: PostData;
}
