/**
 * Types de base pour les médias (images, vidéos, etc.) dans l'application
 *
 * Ce fichier centralise toutes les définitions de types liées aux médias
 * pour éviter la redondance et garantir la cohérence.
 */

/** Type de base pour toute image/média dans l'application */
export interface Media {
  id: string;
  url: string;
  position?: number; // Position pour l'ordre d'affichage
}

/** Média avec métadonnées optionnelles (alt text, etc.) */
export interface MediaWithMetadata extends Media {
  alt?: string;
}

/** État d'upload pour les médias */
export type MediaUploadState = "local" | "uploading" | "uploaded" | "error";

/** Média avec état d'upload pour la gestion des uploads */
export interface MediaWithUploadState extends Media {
  file?: File;
  uploadState: MediaUploadState;
}

/** Média avec position pour la gestion de l'ordre */
export interface MediaWithPosition {
  id: string;
  position: number;
}

/** Requête d'upload de médias */
export interface MediaUploadRequest {
  sessionId: string;
  userToken: string;
  companyId: string;
  medias: MediaWithUploadState[];
}

/** Élément de réponse d'upload */
export interface MediaUploadResponseItem {
  id: string;
  url: string;
  temp_id: string; // Mapping entre ID local et ID serveur
}

/** Réponse complète d'upload */
export interface MediaUploadResponse {
  uploads: MediaUploadResponseItem[];
}
