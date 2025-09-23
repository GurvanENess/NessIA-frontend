export interface NeedUserInput {
  question: string;
  suggested: string[];
}

export interface Job {
  id: string;
  status: "waiting_user" | "running" | "completed" | "error";
  type?: string;
  message?: string;
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
