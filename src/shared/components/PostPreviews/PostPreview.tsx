import React from "react";
import { Post } from "../../../pages/Posts/entities/PostTypes";
import { getPostPreviewComponent, hasCustomPreview } from "./registry";
import { PostPreviewProps } from "./types";

interface PostPreviewFactoryProps {
  /** Le post à afficher */
  post: Post;
  /** Le nom du compte associé à la plateforme */
  accountName: string;
  /** Classes CSS optionnelles pour personnaliser le style */
  className?: string;
  /** Composant de fallback à utiliser si aucune preview personnalisée n'est disponible */
  fallback?: React.ComponentType<PostPreviewProps>;
}

/**
 * Composant factory pour afficher le preview approprié selon la plateforme
 * 
 * Ce composant détermine automatiquement quel composant de preview utiliser
 * en fonction de la plateforme du post. Si aucune preview personnalisée n'est
 * disponible, il utilise le composant de fallback fourni.
 * 
 * @example
 * ```tsx
 * <PostPreview
 *   post={post}
 *   accountName="Mon compte"
 *   fallback={GenericPostPreview}
 * />
 * ```
 */
const PostPreview: React.FC<PostPreviewFactoryProps> = ({
  post,
  accountName,
  className,
  fallback: FallbackComponent,
}) => {
  const PreviewComponent = getPostPreviewComponent(post.platform);

  // Si un composant personnalisé existe, l'utiliser
  if (PreviewComponent) {
    return (
      <PreviewComponent
        post={post}
        accountName={accountName}
        className={className}
      />
    );
  }

  // Sinon, utiliser le fallback s'il est fourni
  if (FallbackComponent) {
    return (
      <FallbackComponent
        post={post}
        accountName={accountName}
        className={className}
      />
    );
  }

  // Si aucun fallback n'est fourni, retourner null
  return null;
};

export default PostPreview;
export { hasCustomPreview };

