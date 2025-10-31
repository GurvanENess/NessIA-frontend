import React from "react";
import { Post } from "../../../pages/Posts/entities/PostTypes";

/**
 * Interface commune pour tous les composants de preview de posts
 */
export interface PostPreviewProps {
  /** Le post à afficher */
  post: Post;
  /** Le nom du compte associé à la plateforme */
  accountName: string;
  /** Classes CSS optionnelles pour personnaliser le style */
  className?: string;
}

/**
 * Type pour les composants de preview
 */
export type PostPreviewComponent = React.ComponentType<PostPreviewProps>;

