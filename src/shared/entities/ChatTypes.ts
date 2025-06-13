import { Action } from "../../pages/Home/entities/mockAITypes";
import { PostData } from "./PostTypes";

export interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
  actions?: Action[];
  handleAction?: (action: Action) => void;
  postData?: PostData;
}
