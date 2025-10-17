import { Media } from "./MediaTypes";
import { PostData } from "./PostTypes";

/** Alias pour la compatibilité - utilise le type de base Media */
export type MessageMedia = Media;

export interface Message {
  id?: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  postData?: PostData;
  media?: Media[];
  // Nouveau champ pour le state
  isLoading?: boolean; // Message en cours de traitement
}
