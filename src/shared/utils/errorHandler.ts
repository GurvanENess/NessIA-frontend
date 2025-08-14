import { toast } from "react-hot-toast";

export const handleError = (error: unknown, message: string) => {
  console.error(error);
  toast.error(message);
  return message;
};

