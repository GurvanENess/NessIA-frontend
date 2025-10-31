import React from "react";
import { PostPlatform } from "../../entities/PostTypes";
import { PostPreviewComponent } from "./types";

/**
 * Registre des composants de preview par plateforme
 * 
 * Pour ajouter une nouvelle plateforme :
 * 1. Créer le composant dans ce dossier (ex: TwitterPostPreview.tsx)
 * 2. Importer le composant ici
 * 3. L'ajouter dans le mapping ci-dessous
 */
import FacebookPostPreview from "./FacebookPostPreview";
import InstagramPostPreview from "./InstagramPostPreview";

type PreviewRegistry = {
  [K in PostPlatform]?: PostPreviewComponent;
};

/**
 * Mapping des plateformes vers leurs composants de preview
 */
export const postPreviewRegistry: PreviewRegistry = {
  instagram: InstagramPostPreview,
  facebook: FacebookPostPreview,
  // Ajoutez ici les nouvelles plateformes :
  // tiktok: TikTokPostPreview,
  // twitter: TwitterPostPreview,
};

/**
 * Récupère le composant de preview pour une plateforme donnée
 * 
 * @param platform - La plateforme pour laquelle récupérer le composant
 * @returns Le composant de preview ou null si non disponible
 */
export const getPostPreviewComponent = (
  platform: PostPlatform
): PostPreviewComponent | null => {
  return postPreviewRegistry[platform] ?? null;
};

/**
 * Vérifie si une plateforme a un composant de preview personnalisé
 * 
 * @param platform - La plateforme à vérifier
 * @returns true si un composant de preview existe, false sinon
 */
export const hasCustomPreview = (platform: PostPlatform): boolean => {
  return platform in postPreviewRegistry;
};

