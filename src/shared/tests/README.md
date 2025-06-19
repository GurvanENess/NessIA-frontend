# Tests Supabase

Ce dossier contient tous les tests pour les fonctionnalités de base de données utilisant Supabase.

## Structure

```
tests/
├── setup.ts                    # Configuration et utilitaires de test
├── runner.ts                   # Runner principal pour exécuter les tests
├── database/
│   ├── auth.test.ts            # Tests d'authentification
│   ├── posts.test.ts           # Tests CRUD pour les posts
│   └── conversations.test.ts   # Tests CRUD pour les conversations
└── README.md                   # Ce fichier
```

## Utilisation

### Exécuter tous les tests

```typescript
import { runTests } from './runner';

// Exécuter tous les tests
await runTests.all();
```

### Exécuter des tests spécifiques

```typescript
// Tests d'authentification uniquement
await runTests.auth();

// Tests des posts uniquement
await runTests.posts();

// Tests des conversations uniquement
await runTests.conversations();
```

### Depuis la console du navigateur

Les tests sont également disponibles globalement dans la console :

```javascript
// Tous les tests
runTests.all();

// Tests spécifiques
runTests.auth();
runTests.posts();
runTests.conversations();
```

## Configuration

### Variables d'environnement

Assurez-vous que les variables suivantes sont configurées dans votre `.env` :

```env
VITE_SUPABASE_URL_PROD=your_supabase_url
VITE_SUPABASE_ANON_KEY_PROD=your_supabase_anon_key
```

### Base de données

Les tests nécessitent que les tables suivantes existent dans votre base Supabase :

#### Table `posts`
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'scheduled')),
  platform TEXT CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'twitter')),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table `conversations`
```sql
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  last_message TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Types de tests

### Tests d'authentification (`auth.test.ts`)
- Inscription d'utilisateur
- Connexion/déconnexion
- Récupération de l'utilisateur actuel
- Mise à jour des métadonnées
- Gestion des erreurs d'authentification

### Tests des posts (`posts.test.ts`)
- Création de posts
- Lecture/récupération
- Mise à jour
- Suppression
- Filtrage par statut et plateforme

### Tests des conversations (`conversations.test.ts`)
- Création de conversations
- Lecture/récupération
- Mise à jour
- Archivage/désarchivage
- Suppression
- Filtrage par statut actif

## Nettoyage automatique

Les tests incluent un système de nettoyage automatique qui :
- Supprime toutes les données de test après chaque session
- Utilise des préfixes `TEST_` pour identifier les données de test
- Se déconnecte automatiquement des utilisateurs de test

## Bonnes pratiques

1. **Isolation** : Chaque test crée ses propres données et les nettoie
2. **Préfixes** : Toutes les données de test utilisent le préfixe `TEST_`
3. **Gestion d'erreurs** : Tous les tests incluent une gestion d'erreurs appropriée
4. **Logging** : Logs détaillés pour faciliter le débogage
5. **Cleanup** : Nettoyage automatique même en cas d'échec

## Exemple d'utilisation

```typescript
import { TestRunner } from './runner';

const testRunner = new TestRunner();

// Exécuter tous les tests
await testRunner.runAllTests();

// Ou exécuter des tests spécifiques
await testRunner.runPostsTests();
```