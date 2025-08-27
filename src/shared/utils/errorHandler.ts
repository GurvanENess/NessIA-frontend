import { toast } from "react-hot-toast";
import { logger } from "./logger";

export const handleError = (error: unknown, message: string) => {
  logger.error(message, error);
  toast.error(message);
  return message;
};
