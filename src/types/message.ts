export interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  showActions?: boolean;
}

export interface MessageActions {
  onValidate?: () => void;
  onCancel?: () => void;
}

export type MessageProps = Message & MessageActions;
