# Post Previews - Architecture modulaire

Ce module fournit un système modulaire et extensible pour afficher des previews de posts selon leur plateforme sociale.

## Structure

```
src/shared/components/PostPreviews/
├── index.ts                    # Point d'entrée principal
├── types.ts                    # Interfaces et types communs
├── registry.ts                 # Registre des composants par plateforme
├── PostPreview.tsx             # Composant factory principal
├── GenericPostPreview.tsx      # Preview générique pour les plateformes non supportées
├── InstagramPostPreview.tsx    # Preview spécifique Instagram
└── FacebookPostPreview.tsx     # Preview spécifique Facebook
```

## Utilisation

### Utilisation basique

```tsx
import { PostPreview } from "@/shared/components/PostPreviews";
import { GenericPostPreview } from "@/shared/components/PostPreviews";

<PostPreview
  post={post}
  accountName="Mon compte"
  fallback={GenericPostPreview}
/>
```

Le composant `PostPreview` sélectionne automatiquement le bon composant de preview selon la plateforme du post (`post.platform`).

### Vérifier si une plateforme a un preview personnalisé

```tsx
import { hasCustomPreview } from "@/shared/components/PostPreviews";

if (hasCustomPreview("instagram")) {
  // Instagram a un preview personnalisé
}
```

## Ajouter une nouvelle plateforme

Pour ajouter le support d'une nouvelle plateforme (ex: TikTok, Twitter) :

### 1. Créer le composant de preview

Créez un nouveau fichier `TikTokPostPreview.tsx` dans ce dossier :

```tsx
import React from "react";
import { PostPreviewProps } from "./types";

const TikTokPostPreview: React.FC<PostPreviewProps> = ({
  post,
  accountName,
  className,
}) => {
  // Implémentation du preview TikTok
  return (
    <div className={className}>
      {/* Votre preview TikTok ici */}
    </div>
  );
};

export default TikTokPostPreview;
```

### 2. Enregistrer le composant

Ajoutez le composant dans `registry.ts` :

```tsx
import TikTokPostPreview from "./TikTokPostPreview";

export const postPreviewRegistry: PreviewRegistry = {
  instagram: InstagramPostPreview,
  facebook: FacebookPostPreview,
  tiktok: TikTokPostPreview, // ← Ajoutez ici
};
```

### 3. Mettre à jour les types (si nécessaire)

Si vous avez ajouté une nouvelle plateforme dans `PostPlatform`, assurez-vous qu'elle est bien typée dans `src/shared/entities/PostTypes.ts`.

C'est tout ! Le système détectera automatiquement votre nouveau composant.

## Interface commune

Tous les composants de preview doivent implémenter l'interface `PostPreviewProps` :

```tsx
interface PostPreviewProps {
  /** Le post à afficher */
  post: Post;
  /** Le nom du compte associé à la plateforme */
  accountName: string;
  /** Classes CSS optionnelles pour personnaliser le style */
  className?: string;
}
```

## Avantages de cette architecture

1. **Modularité** : Chaque plateforme a son propre composant, facile à maintenir
2. **Extensibilité** : Ajouter une nouvelle plateforme nécessite seulement 2 étapes
3. **Uniformité** : Interface commune pour tous les composants
4. **Type-safety** : TypeScript garantit que tous les composants respectent l'interface
5. **Fallback automatique** : Si aucune preview personnalisée n'existe, le preview générique est utilisé

