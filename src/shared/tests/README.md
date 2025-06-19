# Tests Supabase avec Jest

Ce dossier contient tous les tests Jest pour les fonctionnalités de base de données utilisant Supabase.

## Structure

```
tests/
├── setup.ts                    # Configuration Jest et utilitaires de test
├── database/
│   ├── auth.test.ts            # Tests d'authentification
│   ├── posts.test.ts           # Tests CRUD pour les posts
│   └── conversations.test.ts   # Tests CRUD pour les conversations
└── README.md                   # Ce fichier
```

## Installation et Configuration

### 1. Dépendances

Les dépendances Jest sont déjà installées :

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.2"
  }
}
```

### 2. Configuration Jest

Le fichier `jest.config.js` est configuré pour :
- Utiliser TypeScript avec `ts-jest`
- Environnement `jsdom` pour les tests frontend
- Timeout de 30 secondes pour les tests async
- Setup automatique avec `src/shared/tests/setup.ts`

### 3. Variables d'environnement

Assurez-vous que les variables suivantes sont configurées dans votre `.env` :

```env
VITE_SUPABASE_URL_PROD=your_supabase_url
VITE_SUPABASE_ANON_KEY_PROD=your_supabase_anon_key
```

## Utilisation

### Commandes disponibles

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter des tests spécifiques
npm test -- auth.test.ts
npm test -- posts.test.ts
npm test -- conversations.test.ts
```

### Exécuter des suites de tests spécifiques

```bash
# Tests d'authentification uniquement
npm test -- --testNamePattern="Authentication Tests"

# Tests de posts uniquement
npm test -- --testNamePattern="Posts Database Tests"

# Tests de conversations uniquement
npm test -- --testNamePattern="Conversations Database Tests"
```

## Structure des Tests

### Tests d'authentification (`auth.test.ts`)

- **User Registration**
  - Inscription réussie avec données valides
  - Rejet avec email invalide
  - Rejet avec mot de passe faible

- **User Authentication**
  - Connexion avec identifiants valides
  - Rejet avec identifiants invalides
  - Rejet avec email inexistant

- **User Session Management**
  - Récupération de l'utilisateur actuel
  - Déconnexion réussie

- **User Metadata**
  - Mise à jour des métadonnées utilisateur

- **Auth State Changes**
  - Écoute des changements d'état d'authentification

### Tests des posts (`posts.test.ts`)

- **Post Creation**
  - Création réussie avec toutes les données
  - Rejet sans champs requis
  - Validation des statuts et plateformes

- **Post Reading**
  - Récupération par ID utilisateur
  - Récupération par ID de post
  - Filtrage par statut
  - Tri par date de création

- **Post Updates**
  - Mise à jour du titre et description
  - Mise à jour du statut
  - Protection contre les mises à jour non autorisées

- **Post Deletion**
  - Suppression réussie
  - Protection contre les suppressions non autorisées

- **Post Validation**
  - Validation des valeurs de plateforme
  - Validation des valeurs de statut

### Tests des conversations (`conversations.test.ts`)

- **Conversation Creation**
  - Création réussie avec toutes les données
  - Création avec valeurs par défaut
  - Rejet sans champs requis

- **Conversation Reading**
  - Récupération par ID utilisateur
  - Récupération par ID de conversation
  - Filtrage par statut actif
  - Tri par date et nombre de messages

- **Conversation Updates**
  - Mise à jour du titre et message
  - Mise à jour du nombre de messages
  - Archivage et réactivation
  - Protection contre les mises à jour non autorisées

- **Conversation Deletion**
  - Suppression réussie
  - Protection contre les suppressions non autorisées

- **Conversation Statistics**
  - Comptage total des conversations
  - Comptage des conversations actives
  - Calcul du nombre total de messages

## Fonctionnalités des Tests

### Nettoyage automatique

- Chaque test crée ses propres données avec des préfixes `TEST_`
- Nettoyage automatique après chaque suite de tests
- Déconnexion automatique des utilisateurs de test

### Isolation des tests

- Chaque test est indépendant
- Utilisation de `beforeEach` et `afterEach` pour la préparation/nettoyage
- Données de test uniques pour éviter les conflits

### Gestion d'erreurs

- Tests des cas d'erreur et de validation
- Vérification des permissions utilisateur
- Tests de sécurité (accès non autorisé)

### Assertions complètes

- Vérification des données retournées
- Validation des types et structures
- Tests de performance (tri, filtrage)

## Bonnes Pratiques

1. **Préfixes de test** : Toutes les données utilisent `TEST_` pour faciliter le nettoyage
2. **Isolation** : Chaque test est indépendant et nettoie ses données
3. **Assertions explicites** : Vérifications détaillées des résultats attendus
4. **Gestion d'erreurs** : Tests des cas d'erreur et de validation
5. **Performance** : Tests de tri et filtrage pour valider les performances

## Exemple d'exécution

```bash
$ npm test

> jest

 PASS  src/shared/tests/database/auth.test.ts
 PASS  src/shared/tests/database/posts.test.ts
 PASS  src/shared/tests/database/conversations.test.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        12.345 s
```

## Débogage

Pour déboguer les tests :

```bash
# Mode verbose pour plus de détails
npm test -- --verbose

# Exécuter un seul test
npm test -- --testNamePattern="should create a new post successfully"

# Mode watch pour développement
npm run test:watch
```