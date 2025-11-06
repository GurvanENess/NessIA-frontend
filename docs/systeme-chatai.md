# Système ChatAI - Fonctionnement et Architecture

## Vue d'ensemble

Le système ChatAI de NessIA permet aux utilisateurs d'interagir avec une intelligence artificielle via une interface de chat. Le système utilise n8n comme backend pour traiter les requêtes et gère les sessions de conversation de manière asynchrone.

## Architecture

### 1. Composants Principaux

#### ChatAI (`src/pages/Home/components/ChatAI.tsx`)

- **Fonction** : Composant principal orchestrant le chat
- **État** : Gère les messages, la session et l'état de chargement
- **Logique** : Coordonne l'envoi des messages et la réception des réponses

#### ChatInput (`src/pages/Home/components/ChatInput.tsx`)

- **Fonction** : Interface de saisie des messages
- **Fonctionnalités** :
  - Saisie de texte
  - Affichage du statut des jobs
  - Actions rapides (QuickActions)

#### MessageList (`src/pages/Home/components/MessageList.tsx`)

- **Fonction** : Affichage de la liste des messages
- **Rendu** : Messages utilisateur et IA avec formatage Markdown

### 2. Services et API

#### AIClient (`src/pages/Home/services/AIClient.ts`)

```typescript
class AIClient {
  // Envoie une requête initiale à l'IA
  getResponse: AIRequestFunction = async (request: AIRequest): Promise<AIResponse>

  // Envoie une réponse utilisateur à un job en cours
  sendAnswerToSuggestion = async (params): Promise<unknown>
}
```

**Endpoints n8n** :

- **Production** : `VITE_N8N_URL_PROD` - Traitement initial des messages
- **Jobs** : `VITE_N8N_URL_JOBS_USERINPUT` - Réponses aux suggestions

**Headers requis** :

- `Authorization` : Token d'authentification n8n
- `x-user-auth` : Token utilisateur Supabase
- `x-user-session` : ID de session de chat

### 3. Gestion des Sessions

#### Session ID

- **Génération** : Créé automatiquement par n8n lors de la première requête
- **Persistance** : Stocké dans l'URL (`/chats/:chatId`)
- **Navigation** : Redirection automatique vers l'URL de session

#### Messages

```typescript
interface Message {
  id: string;
  isAi: boolean;
  content: string;
  timestamp: Date;
  postData?: any; // Données de post Instagram (optionnel)
}
```

### 4. Système de Polling des Jobs

#### useJobPolling (`src/shared/hooks/useJobPolling.ts`)

```typescript
const {
  jobs, // Liste des jobs en cours
  startPolling, // Démarrer la surveillance
  stopPolling, // Arrêter la surveillance
} = useJobPolling();
```

**Fonctionnement** :

1. **Intervalle** : Vérification toutes les 2 secondes
2. **Arrêt automatique** : Quand tous les jobs sont terminés ou en attente utilisateur
3. **Promesse** : Retourne une promesse résolue avec les jobs finaux

**Types de jobs** :

- `waiting_user` : En attente d'une réponse utilisateur
- `running` : En cours de traitement
- `completed` : Terminé

## Flux de Fonctionnement

### 1. Envoi d'un Message

```
Utilisateur saisit → ChatInput → ChatAI.processUserMessage() →
Ajout au state → Appel AIClient.getResponse() →
Démarrage du polling → Redirection vers /chats/:sessionId
```

### 2. Traitement IA

```
n8n reçoit la requête → Traitement asynchrone →
Mise à jour des jobs → Polling détecte les changements →
Affichage du statut dans JobStatus
```

### 3. Réponse Utilisateur (si nécessaire)

```
Job en attente → Utilisateur clique sur suggestion →
AIClient.sendAnswerToSuggestion() →
Reprise du traitement → Nouveau polling
```

### 4. Récupération des Messages

```
Session existante → db.getChatSessionMessages() →
Formatage des messages → Affichage dans MessageList
```

## Gestion des États

### États de Chargement

- **`isLoading`** : Traitement d'un message en cours
- **`isPolling`** : Surveillance des jobs active
- **`showQuickActions`** : Affichage des actions rapides

### Gestion des Erreurs

- **Erreurs réseau** : Affichage de toast d'erreur
- **Erreurs de session** : Redirection vers la page d'accueil
- **Erreurs de base de données** : Logs console et gestion gracieuse

## Fonctionnalités Avancées

### 1. Actions Rapides (QuickActions)

- **Affichage** : Seulement pour le premier message
- **Actions** : Suggestions prédéfinies pour démarrer la conversation
- **Gestion** : Masquage automatique après utilisation

### 2. Suggestions de Jobs

- **Affichage** : Via le composant JobStatus
- **Interaction** : Clic pour répondre aux suggestions
- **Format** : Affichage du statut et des actions disponibles

### 3. Formatage Markdown

- **Configuration** : `src/shared/utils/markdownConfig.tsx`
- **Rendu** : Utilisation de `react-markdown`
- **Styles** : Classes Tailwind personnalisées

## Intégration Base de Données

### Tables utilisées

- **`chat_sessions`** : Sessions de conversation
- **`chat_messages`** : Messages individuels
- **`jobs`** : Statut des tâches de traitement

### Opérations principales

- **Lecture** : Récupération des messages existants
- **Écriture** : Sauvegarde des nouveaux messages
- **Mise à jour** : Statut des jobs

## Configuration et Variables d'Environnement

### Variables requises

```bash
VITE_N8N_URL_PROD=https://n8n.eness.fr/webhook/nessia/chatbot/v3-1
VITE_N8N_URL_JOBS_USERINPUT=https://n8n.eness.fr/webhook/nessia/jobs/userinput
VITE_N8N_AUTH=your_n8n_auth_token
```

### Configuration n8n

- **Webhook** : Point d'entrée pour les requêtes initiales
- **Workflow** : Traitement asynchrone des messages
- **Authentification** : Token d'API requis

## Points d'Attention

### Performance

- **Polling** : Intervalle de 2 secondes peut être ajusté
- **Messages** : Limitation du nombre de messages affichés
- **Cache** : Pas de mise en cache côté client

### Sécurité

- **Tokens** : Authentification via Supabase et n8n
- **Sessions** : Vérification de propriété par compagnie
- **Validation** : Vérification des données côté serveur

### Robustesse

- **Gestion d'erreurs** : Try-catch sur toutes les opérations async
- **Fallbacks** : Affichage d'états de chargement et d'erreur
- **Récupération** : Redémarrage automatique du polling en cas d'échec

## Utilisation et Développement

### Ajout de nouvelles fonctionnalités

1. **Nouveau type de message** : Étendre l'interface `Message`
2. **Nouvelle action rapide** : Modifier le composant `QuickActions`
3. **Nouveau statut de job** : Étendre la logique de polling

### Debug et Maintenance

- **Logs** : Console.log sur les opérations critiques
- **État** : Utilisation des Redux DevTools pour le debugging
- **Monitoring** : Surveillance des jobs et des sessions

## Structure des Données

### Requête IA

```typescript
interface AIRequest {
  message: string;
  sessionId?: string;
  userToken: string;
  companyId: string;
}
```

### Réponse IA

```typescript
interface AIResponse {
  message: string;
  sessionId: string;
  // ... autres données
}
```

### Job

```typescript
interface Job {
  id: string;
  status: "waiting_user" | "running" | "completed";
  agentIndex: number;
  // ... autres propriétés
}
```

## Gestion des Sessions

### Création de session

- **Première requête** : n8n génère un sessionId
- **Stockage** : Sauvegarde dans l'URL et le state
- **Persistance** : Récupération depuis la base de données

### Navigation entre sessions

- **URL dynamique** : `/chats/:chatId`
- **Chargement** : Récupération automatique des messages
- **État** : Synchronisation avec le composant ChatAI

## Optimisations Possibles

### Performance

- **Lazy loading** : Chargement des messages par pages
- **Debouncing** : Réduction des appels API
- **Memoization** : Cache des composants React

### UX

- **Typing indicators** : Indicateurs de frappe
- **Auto-scroll** : Défilement automatique vers le bas
- **Notifications** : Alertes pour les nouveaux messages

### Robustesse

- **Retry logic** : Tentatives de reconnexion
- **Offline support** : Gestion du mode hors ligne
- **Error boundaries** : Gestion des erreurs React
