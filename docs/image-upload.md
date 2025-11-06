# Image Upload Flow

Ce document decrit la nouvelle logique d'upload d'images pour la page Home.

## Entites
- `MediaWithUploadState` (src/pages/Home/entities/media.ts) definit l'identifiant, l'URL, le fichier source optionnel et l'etat d'upload (`local`, `uploading`, `uploaded`, `error`).
- `MediaUploadRequest` regroupe les identifiants session/utilisateur/entreprise et la liste des medias a transmettre.
- `MediaUploadResponse` normalise la reponse attendue de l'API (tableau `uploads` avec `id`, `url`, `temp_id`).

## Services
Fichier: `src/pages/Home/services/mediaUploadService.ts`

Fonctions clefs:
- `createMediaFromFiles(files)` lit chaque image via FileReader et produit des apercus base64 avec un identifiant local (`local_<uuid>`).
- `uploadMediaBatch({ sessionId, userToken, companyId, medias })` s'appuie sur `AiClient.sendMedias` et renvoie les medias acceptes par l'API.
- `markMediaAsUploading`, `markMediaAsError`, `mergeUploadedMedia`, `getPendingMedia` offrent des helpers purs pour transformer la liste courante selon l'etat du transfert.

## Hook `useImageUpload`
Localisation: `src/pages/Home/hooks/useImageUpload.ts`

### API publique
- `addFilesToUpload(files: FileList | File[])` filtre les images, genere les apercus et declenche l'upload automatique.
- `uploadImages(images?: MediaWithUploadState[])` force un nouvel envoi (utile pour re-essayer les medias en erreur).
- `uploadError: string | null` expose le dernier message d'erreur lisible.
- `isUploading: boolean` signale qu'un envoi est en cours.

### Parametres
- `sessionId`, `userToken`, `companyId`: obligatoires pour contacter l'API; si absents la tentative est avortee et l'erreur est remontee.
- `currentImages`: liste source geree par le composant parent.
- `onImagesChange`: callback declenche apres chaque transformation (ajout local, passage a uploading, succes, erreur).
- `onError`: callback optionnel pour logger ou afficher des messages specifiques.

### Fonctionnement
1. Conversion locale: `createMediaFromFiles` retourne des medias `local` avec un champ `file` pour l'envoi.
2. Upload optimiste: la selection est marquee `uploading` et notifiee au parent.
3. Synchronisation backend: `uploadMediaBatch` retourne les medias definitifs via `temp_id`; `mergeUploadedMedia` remplace l'id temporaire par l'id definitive et supprime le fichier local.
4. Gestion des erreurs: en cas d'echec, les medias touches sont marques `error` (le `file` reste present pour retente) et `uploadError` contient un message explicite.

## Integrations UI
- `MediaSection` consomme le hook en lui passant les credentiels et le setter `onImagesChange`. L'affichage utilise `uploadState` pour montrer la progression et un message de feedback via `uploadError`.
- `EditTab` conserve une source de verite unique: `MediaSection` renvoie tous les medias, tandis que le formulaire nettoie les images encore locales/erreur avant sauvegarde.

## Bonnes pratiques
- Les composants doivent conserver la liste entiere des medias fournie par le hook afin de permettre les transitions d'etat (local -> uploading -> uploaded | error).
- Pour relancer un upload en erreur, rappeler `uploadImages()` sans argument: le hook detecte automatiquement les medias non `uploaded` disposant d'un `file`.
- Toujours verifier que `sessionId`, `userToken` et `companyId` sont accessibles avant d'afficher le bouton d'upload afin d'eviter une experience frustrante.
- Le service `mediaUploadService` est pur et reutilisable: pour d'autres pages, re-importer les helpers et garder la meme separation (entities -> services -> hooks -> components).
