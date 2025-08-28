# Gestion globale de l'état

Le projet utilise désormais [Zustand](https://github.com/pmndrs/zustand) pour la gestion de l'état global.

## `useAppStore`

`useAppStore` centralise l'état partagé de l'application :

- `post` : données et statut du post en cours d'édition.
- `chat` : messages, saisie utilisateur et indicateurs de chargement.
- `postPanel` : ouverture du panneau de visualisation de post.
- `currentCompany` : compagnie active, persistée dans `localStorage`.
- `error` : message d'erreur global.

Chaque sous-état possède des fonctions dédiées pour sa mise à jour (ex. `setChatSessionId`, `updatePostData`, `openPostPanel`, `resetChat`, etc.).

## `useAuthStore`

`useAuthStore` gère l'authentification via Supabase :

- `user`, `isAuthenticated`, `isLoading`
- actions `login`, `logout`, `signup`
- mise à jour automatique de l'utilisateur sur les changements d'état Supabase.

## Stores spécifiques

Certains modules disposent d'un store local utilisant aussi Zustand :

- `useChatsStore` pour la liste des conversations.
- `usePostsStore` pour les publications.
- `useLoginStore` et `useRegisterStore` pour l'état des formulaires d'authentification.

Ces stores restent isolés dans leurs pages respectives afin de limiter le partage d'état au strict nécessaire.
