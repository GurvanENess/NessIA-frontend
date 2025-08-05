# Système d'affichage des statuts de jobs

## Vue d'ensemble

Le système d'affichage des statuts de jobs permet de montrer visuellement l'état des tâches en cours dans l'interface utilisateur. Il s'adapte automatiquement aux différents statuts et fournit un feedback visuel en temps réel.

## Composants

### 1. JobStatus

Le composant `JobStatus` affiche les jobs actifs avec des indicateurs visuels appropriés.

**Localisation :** `src/pages/Home/components/JobStatus.tsx`

**Fonctionnalités :**

- Affichage des jobs avec icônes et couleurs adaptées au statut
- Animations fluides et transitions
- Support pour tous les types de statuts
- Design responsive et moderne
- **Nouveau :** Affichage des questions et suggestions pour `waiting_user`

### 2. ChatInput amélioré

Le composant `ChatInput` a été amélioré pour intégrer l'affichage des jobs.

**Fonctionnalités ajoutées :**

- Désactivation automatique quand des jobs sont actifs
- Placeholder adaptatif selon le statut des jobs
- Intégration du composant JobStatus
- **Nouveau :** Gestion des suggestions avec boutons d'action

## Types de statuts supportés

### `running`

- **Icône :** Spinner animé (bleu)
- **Couleur :** Bleu
- **Message :** "NessIA travaille sur votre demande..."
- **Comportement :** Animation de points pulsants

### `waiting_user` ⭐ **NOUVEAU**

- **Icône :** Horloge (ambre)
- **Couleur :** Ambre
- **Message :** "En attente de votre réponse..."
- **Comportement :**
  - Interface désactivée pour forcer l'interaction
  - **Affichage de la question** depuis `need_user_input.question`
  - **Boutons de suggestions** avec couleurs call-to-action
  - **Clic sur suggestion** envoie automatiquement le message

### `completed`

- **Icône :** Cercle de validation (vert)
- **Couleur :** Vert
- **Message :** "Tâche terminée"
- **Comportement :** Affichage temporaire puis disparition

### `failed`

- **Icône :** Cercle d'alerte (rouge)
- **Couleur :** Rouge
- **Message :** "Erreur lors du traitement"
- **Comportement :** Affichage avec option de retry

## Structure des données pour `waiting_user`

### Format attendu

```typescript
{
  id: "job-123",
  status: "waiting_user",
  data: {
    need_user_input: {
      question: "Quel type de post souhaitez-vous créer ?",
      suggested: ["Post Instagram", "Post Facebook", "Post LinkedIn"]
    }
  }
}
```

### Types TypeScript

```typescript
interface NeedUserInput {
  question: string;
  suggested: string[];
}

interface Job {
  id: string;
  status: "waiting_user" | "running" | "completed" | "failed";
  data?: {
    need_user_input?: NeedUserInput;
    [key: string]: any;
  };
  // ... autres propriétés
}
```

## Utilisation

### Dans ChatAI.tsx

```typescript
import useJobPolling from "../../../shared/hooks/useJobPolling";

const Chat: React.FC = () => {
  const { jobs, startPolling, isPolling } = useJobPolling(sessionIdParam);

  // Les jobs sont automatiquement passés au ChatInput
  return (
    <>
      <MessageList messages={messages} handleAction={handleAction} />
      <ChatInput
        value={messageInput}
        onChange={(value) =>
          dispatch({ type: "SET_MESSAGE_INPUT", payload: value })
        }
        onSend={handleSendMessage}
        isLoading={isLoading}
        jobs={jobs} // ← Les jobs sont passés ici
      />
    </>
  );
};
```

### Gestion des suggestions

Le système gère automatiquement les suggestions :

```typescript
// Dans ChatInput.tsx
const handleSuggestionClick = (suggestion: string) => {
  // Envoyer directement la suggestion comme message
  onSend(suggestion, false);
};

// Passé au JobStatus
<JobStatus jobs={jobs} onSuggestionClick={handleSuggestionClick} />;
```

### Hook useJobPolling

Le hook gère automatiquement :

- La récupération des jobs
- Le polling asynchrone
- La mise à jour des statuts
- L'arrêt automatique quand plus de jobs actifs

```typescript
const { jobs, startPolling, isPolling } = useJobPolling(sessionId);

// Démarrer le polling (asynchrone)
await startPolling();

// Les jobs sont automatiquement mis à jour
console.log("Jobs actifs:", jobs);
```

## Styles et animations

### Animations CSS

- **fade-in-up :** Animation d'entrée pour les nouveaux jobs
- **pulse :** Animation pour les indicateurs de progression
- **spin :** Animation pour l'icône de chargement

### Classes Tailwind utilisées

- **Couleurs :** `blue-500`, `amber-500`, `green-500`, `red-500`
- **Transitions :** `transition-all duration-300 ease-out`
- **Effets :** `hover:scale-[1.02]`, `backdrop-blur-sm`
- **Responsive :** `fixed bottom-32`, `max-w-2xl mx-auto`
- **Boutons suggestions :** `bg-[#7C3AED] hover:bg-[#6D28D9]`

## Comportements

### Désactivation automatique

Quand des jobs sont actifs (`running` ou `waiting_user`) :

- Le textarea est désactivé
- Le bouton d'envoi est désactivé
- Le placeholder change pour indiquer l'état
- Les boutons d'action sont désactivés

### Affichage conditionnel

- Les jobs ne s'affichent que s'ils existent
- Animation d'entrée pour chaque job
- Disparition automatique quand terminés
- Support pour plusieurs jobs simultanés

### Gestion des suggestions ⭐ **NOUVEAU**

Quand un job a le statut `waiting_user` :

- Affichage de la question en gras
- Boutons de suggestions avec couleur call-to-action
- Clic sur suggestion envoie automatiquement le message
- Interface désactivée pour forcer l'utilisation des suggestions

### Gestion des erreurs

- Affichage des erreurs avec icône rouge
- Message explicite pour l'utilisateur
- Possibilité de retry (à implémenter)

## Personnalisation

### Modifier les couleurs

Dans `JobStatus.tsx`, modifier la fonction `getStatusColor` :

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "border-blue-200 bg-blue-50/90"; // ← Modifier ici
    // ...
  }
};
```

### Modifier les messages

Dans `JobStatus.tsx`, modifier la fonction `getStatusText` :

```typescript
const getStatusText = (status: string) => {
  switch (status) {
    case "running":
      return "NessIA travaille sur votre demande..."; // ← Modifier ici
    // ...
  }
};
```

### Modifier les couleurs des boutons de suggestions

Dans `JobStatus.tsx`, modifier la classe CSS des boutons :

```typescript
<button className="px-3 py-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
  {suggestion}
</button>
```

### Modifier l'intervalle de polling

Dans `useJobPolling.ts` :

```typescript
const POLLING_INTERVAL = 2000; // ← Modifier ici (en millisecondes)
```

## Bonnes pratiques

### 1. Toujours utiliser les types

```typescript
import { Job, NeedUserInput } from "../../../shared/entities/JobTypes";

const jobs: Job[] = [];
```

### 2. Gérer les états de chargement

```typescript
const hasActiveJobs = jobs.some(
  (job) => job.status === "running" || job.status === "waiting_user"
);
```

### 3. Nettoyer le polling

Le hook gère automatiquement le nettoyage, mais vous pouvez forcer l'arrêt :

```typescript
const { stopPolling } = useJobPolling(sessionId);

useEffect(() => {
  return () => {
    stopPolling();
  };
}, []);
```

### 4. Tester les différents statuts

Pour tester l'affichage, vous pouvez simuler différents statuts :

```typescript
const mockJobs: Job[] = [
  {
    id: "1",
    status: "running",
    message: "Traitement en cours...",
  },
  {
    id: "2",
    status: "waiting_user",
    data: {
      need_user_input: {
        question: "Quel type de contenu préférez-vous ?",
        suggested: ["Vidéo", "Image", "Texte"],
      },
    },
  },
];
```

## Exemples d'utilisation

### Exemple 1 : Choix de plateforme

```typescript
{
  id: "job-platform-choice",
  status: "waiting_user",
  data: {
    need_user_input: {
      question: "Sur quelle plateforme souhaitez-vous publier ?",
      suggested: ["Instagram", "Facebook", "LinkedIn", "TikTok"]
    }
  }
}
```

### Exemple 2 : Choix de style

```typescript
{
  id: "job-style-choice",
  status: "waiting_user",
  data: {
    need_user_input: {
      question: "Quel style de post préférez-vous ?",
      suggested: ["Professionnel", "Décontracté", "Créatif", "Minimaliste"]
    }
  }
}
```

### Exemple 3 : Confirmation

```typescript
{
  id: "job-confirmation",
  status: "waiting_user",
  data: {
    need_user_input: {
      question: "Êtes-vous satisfait du résultat ?",
      suggested: ["Oui, c'est parfait", "Non, refaire", "Modifier légèrement"]
    }
  }
}
```

## Dépannage

### Les jobs ne s'affichent pas

1. Vérifier que `jobs` est passé au composant `ChatInput`
2. Vérifier que le hook `useJobPolling` est bien utilisé
3. Vérifier les logs de la console pour les erreurs

### Le polling ne fonctionne pas

1. Vérifier que `sessionId` est défini
2. Vérifier que `startPolling()` est appelé
3. Vérifier les erreurs réseau dans la console

### Les suggestions ne s'affichent pas

1. Vérifier que le job a le statut `waiting_user`
2. Vérifier que `data.need_user_input` est présent
3. Vérifier que `need_user_input.question` et `need_user_input.suggested` sont définis

### Les animations ne fonctionnent pas

1. Vérifier que Tailwind CSS est bien configuré
2. Vérifier que les classes CSS sont bien appliquées
3. Vérifier la compatibilité du navigateur
