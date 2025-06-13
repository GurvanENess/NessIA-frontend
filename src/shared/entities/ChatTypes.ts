import { Action } from "./mockAITypes";
import { BasePostData } from "./BaseTypes";

export interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
  actions?: Action[];
  handleAction?: (action: Action) => void;
  postData?: BasePostData;
}
