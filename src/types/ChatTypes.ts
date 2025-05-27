import { Action } from "./mockAITypes";

export interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
  actions?: Action[];
  handleAction?: (action: Action) => void;
}
