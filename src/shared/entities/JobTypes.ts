export interface UserInputField {
  name: string;
  type: "text" | "boolean" | "number" | "select" | "textarea" | "media_selector";
  value: string | boolean | number | null | Array<{ id: string; url: string }>;
  required?: boolean;
  placeholder?: string;
  label?: string;
  options?: Array<{ label: string; value: string | number }>;
  labels?: Record<string, string>;
}

export interface NeedUserInput {
  key: string;
  title: string;
  fields: UserInputField[];
  description?: string;
  // Support de l'ancienne structure pour compatibilité
  question?: string;
  suggested?: string[];
}

export interface Job {
  id: string;
  status: "waiting_user" | "running" | "completed" | "error";
  type?: string;
  message?: string;
  current_msg?: string;
  created_at?: string;
  session_id?: string;
  user_id?: string;
  need_user_input?: NeedUserInput;
}

export type JobStatus = Job["status"];

export interface JobPollingState {
  jobs: Job[];
  isPolling: boolean;
  error: string | null;
}
