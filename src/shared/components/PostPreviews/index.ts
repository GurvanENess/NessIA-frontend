/**
 * Point d'entrée principal pour les composants de preview de posts
 * 
 * Ce module exporte tous les composants et utilitaires nécessaires
 * pour afficher des previews de posts selon leur plateforme.
 */

export { default as PostPreview } from "./PostPreview";
export { default as GenericPostPreview } from "./GenericPostPreview";
export { default as InstagramPostPreview } from "./InstagramPostPreview";
export { default as FacebookPostPreview } from "./FacebookPostPreview";

export { getPostPreviewComponent, hasCustomPreview } from "./registry";
export type { PostPreviewProps, PostPreviewComponent } from "./types";

