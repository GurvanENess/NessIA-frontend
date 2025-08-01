# Guide d'utilisation du Long Polling pour les Jobs

## Vue d'ensemble

Le système de long polling permet de surveiller en temps réel l'état des jobs (tâches) en cours d'exécution côté serveur. Il est particulièrement utile pour les tâches asynchrones qui nécessitent une interaction utilisateur ou qui prennent du temps à s'exécuter.

## Fonctionnement

### 1. Hook useJobPolling

Le hook `useJobPolling` gère automatiquement :

- La récupération des jobs en cours
- Le polling automatique quand des jobs sont actifs
- L'arrêt du polling quand plus de jobs sont en cours
- La gestion des erreurs

```typescript
const {
  jobs, // Liste des jobs en cours
  isPolling, // État du polling (true/false)
  error, // Erreur éventuelle
  fetchJobs, // Fonction pour récupérer les jobs
  startPolling, // Fonction pour démarrer le polling manuellement
  stopPolling, // Fonction pour arrêter le polling
} = useJobPolling();
```

### 2. Déclenchement du polling

Le polling se déclenche automatiquement dans deux cas :

#### A. Au chargement de la page

```typescript
useEffect(() => {
  if (sessionId) {
    fetchJobs(sessionId);
  }
}, [sessionId]);
```

#### B. Après l'envoi d'un message

```typescript
const processAiResponse = async (message: string) => {
  const response = await AiClient.getResponse({...});

  // Lancer le polling pour surveiller les jobs
  await startPolling(response.sessionId);
};
```

### 3. Polling automatique

Quand des jobs sont détectés avec le statut `"running"` ou `"waiting_user"`, le polling se lance automatiquement toutes les 2 secondes :

```typescript
useEffect(() => {
  if (!hasRunningJobs || !isPolling) return;

  const id = setInterval(async () => {
    await fetchJobs(sessionId!);
  }, 2000);

  return () => clearInterval(id);
}, [hasRunningJobs, isPolling, sessionId, fetchJobs]);
```

## Types de Jobs

### Job en cours d'exécution (`"running"`)

- Le job est en train de s'exécuter côté serveur
- Affichage d'un indicateur de progression
- Polling automatique pour suivre l'avancement

### Job en attente d'interaction (`"waiting_user"`)

- Le job a besoin d'une interaction utilisateur
- Affichage des options disponibles
- Boutons d'interaction pour continuer le processus

## Interface utilisateur

### Affichage des jobs

Les jobs sont affichés dans une zone fixe au bas de l'écran avec :

- Indicateur visuel animé (point violet pulsant)
- Statut du job (en cours / en attente)
- Message de progression
- Boutons d'interaction si nécessaire

### Interactions utilisateur

```typescript
const handleJobInteraction = async (jobId: string, userInput: any) => {
  // Envoyer l'interaction au serveur
  console.log("Sending user interaction for job:", jobId, userInput);

  // Relancer le polling pour voir les mises à jour
  if (sessionId) {
    await startPolling(sessionId);
  }
};
```

## Gestion des erreurs

### Erreurs de récupération

```typescript
const fetchJobs = useCallback(async (sessionId: string) => {
  try {
    const data = await db.getRunningJobs(sessionId);
    setJobs(data || []);
    setError(null);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    setError("Failed to fetch jobs");
  }
}, []);
```

### Nettoyage automatique

Le polling s'arrête automatiquement quand :

- Plus de jobs en cours
- Le composant se démonte
- Une erreur survient

## Bonnes pratiques

### 1. Toujours utiliser useCallback

```typescript
const fetchJobs = useCallback(async (sessionId: string) => {
  // ...
}, []);
```

### 2. Nettoyer le polling

```typescript
useEffect(() => {
  return () => {
    if (isPolling) {
      stopPolling();
    }
  };
}, [isPolling, stopPolling]);
```

### 3. Gérer les états de chargement

```typescript
{
  isLoading && <p className="text-sm text-gray-500">NessIA rédige...</p>;
}
```

### 4. Afficher les jobs de manière non-intrusive

```typescript
{
  jobs.length > 0 && (
    <div className="fixed bottom-32 left-0 right-0 z-10">
      {/* Affichage des jobs */}
    </div>
  );
}
```

## Exemple d'utilisation complète

```typescript
const Chat: React.FC = () => {
  const { fetchJobs, jobs, isPolling, startPolling, stopPolling } = useJobPolling();

  const processAiResponse = async (message: string) => {
    const response = await AiClient.getResponse({...});

    // Lancer le polling après l'envoi
    await startPolling(response.sessionId);
  };

  const handleJobInteraction = async (jobId: string, userInput: any) => {
    // Traiter l'interaction
    await sendJobInteraction(jobId, userInput);

    // Relancer le polling
    await startPolling(sessionId);
  };

  return (
    <>
      {/* Affichage des messages */}
      <MessageList messages={messages} />

      {/* Affichage des jobs */}
      {jobs.length > 0 && <JobStatus jobs={jobs} onInteraction={handleJobInteraction} />}

      {/* Input de chat */}
      <ChatInput onSend={handleSendMessage} />
    </>
  );
};
```

## Configuration

### Intervalle de polling

Par défaut : 2000ms (2 secondes)

```typescript
const id = setInterval(async () => {
  await fetchJobs(sessionId!);
}, 2000); // Modifier cette valeur selon vos besoins
```

### Types de statuts surveillés

```typescript
const hasRunningJobs = jobs.some((j) =>
  ["running", "waiting_user"].includes(j.status)
);
```

## Dépannage

### Le polling ne se lance pas

1. Vérifier que `sessionId` est défini
2. Vérifier que des jobs avec le bon statut existent
3. Vérifier les logs de la console

### Le polling ne s'arrête pas

1. Vérifier que `hasRunningJobs` retourne `false`
2. Vérifier que `stopPolling()` est appelé
3. Vérifier le nettoyage dans `useEffect`

### Erreurs de hooks React

1. S'assurer que tous les hooks sont appelés dans le même ordre
2. Utiliser `useCallback` pour les fonctions dans les dépendances
3. Éviter les conditions avant les appels de hooks
