# Système de Compagnies et d'Autorisations

## Vue d'ensemble

Le système de compagnies et d'autorisations de NessIA permet de gérer l'accès aux ressources (posts, chats) en fonction de la compagnie sélectionnée par l'utilisateur. Chaque utilisateur peut appartenir à plusieurs compagnies et doit en sélectionner une pour accéder aux fonctionnalités de l'application.

## Architecture

### 1. Contextes et État Global

#### AppContext (`src/shared/contexts/AppContext.tsx`)

- **État** : Gère la compagnie actuellement sélectionnée
- **Persistance** : Sauvegarde automatique dans le localStorage
- **Actions** :
  - `SET_CURRENT_COMPANY` : Définit la compagnie active
  - `CLEAR_CURRENT_COMPANY` : Supprime la compagnie active
  - `CHANGE_COMPANY_AND_RESET` : Change de compagnie et réinitialise l'état

#### AuthContext (`src/shared/contexts/AuthContext.tsx`)

- **État** : Gère l'authentification de l'utilisateur
- **Données** : Informations utilisateur (ID, email, nom, token)

### 2. Routes et Protection

#### ProtectedRoute (`src/routes/ProtectedRoute.tsx`)

- **Fonction** : Vérifie l'authentification de l'utilisateur
- **Options** :
  - `requireCompany: false` : Route accessible sans compagnie (ex: sélection de compagnie)
  - `requireCompany: true` : Route nécessitant une compagnie sélectionnée

#### CompanyProtectedRoute (`src/routes/CompanyProtectedRoute.tsx`)

- **Fonction** : Vérifie l'accès aux ressources spécifiques (posts/chats)
- **Logique** : Utilise le hook `useCompanyResourceAccess` pour vérifier les permissions

### 3. Hook d'Accès aux Ressources

#### useCompanyResourceAccess (`src/shared/hooks/useCompanyResourceAccess.ts`)

```typescript
interface UseCompanyResourceAccessReturn {
  hasAccess: boolean; // L'utilisateur a-t-il accès à la ressource ?
  isLoading: boolean; // Vérification en cours ?
  resourceData: any | null; // Données de la ressource si accessible
  error: string | null; // Erreur éventuelle
}
```

**Fonctionnement** :

1. Récupère l'ID de la ressource depuis les paramètres de route
2. Vérifie que l'utilisateur a une compagnie sélectionnée
3. Interroge la base de données pour vérifier l'appartenance de la ressource
4. Redirige vers la page 404 si l'accès est refusé

### 4. Gestion des Compagnies

#### CompanySelectionPage (`src/pages/CompanySelection/CompanySelectionPage.tsx`)

- **Fonction** : Interface de sélection de compagnie
- **Données** : Liste des compagnies de l'utilisateur via `db.getCompaniesByUserId()`
- **Action** : Définit la compagnie active et redirige vers l'accueil

#### UserAccountDropdown (`src/shared/components/UserAccountDropdown.tsx`)

- **Fonction** : Permet de changer de compagnie depuis le menu utilisateur
- **Action** : Utilise `changeCompanyAndReset()` pour changer de compagnie

## Flux d'Autorisation

### 1. Connexion Utilisateur

```
Login → AuthContext (user) → CompanySelectionPage → AppContext (company)
```

### 2. Accès aux Ressources

```
Route protégée → ProtectedRoute (auth) → CompanyProtectedRoute (company access) → Ressource
```

### 3. Changement de Compagnie

```
UserAccountDropdown → changeCompanyAndReset() → AppContext (new company) → Redirection
```

## Base de Données

### Tables impliquées

- **`company`** : Informations des compagnies
- **`user`** : Utilisateurs (via Supabase Auth)
- **`posts`** : Posts liés à une compagnie
- **`chats`** : Sessions de chat liées à une compagnie

### Relations

- Un utilisateur peut appartenir à plusieurs compagnies
- Chaque ressource (post/chat) appartient à une seule compagnie
- L'accès est vérifié via `company_id` dans les requêtes

## Sécurité

### Vérifications

1. **Authentification** : L'utilisateur doit être connecté
2. **Compagnie** : Une compagnie doit être sélectionnée
3. **Propriété** : La ressource doit appartenir à la compagnie active
4. **Redirection** : Accès refusé → Page 404

### Points d'attention

- Les tokens d'authentification sont gérés par Supabase
- La persistance de la compagnie se fait en localStorage (non sécurisé pour des données sensibles)
- Les vérifications côté client sont complétées par des vérifications côté serveur

## Utilisation

### Dans un composant

```typescript
import { useCompanyResourceAccess } from "../shared/hooks/useCompanyResourceAccess";

const MyComponent = () => {
  const { hasAccess, isLoading, resourceData } =
    useCompanyResourceAccess("post");

  if (isLoading) return <LoadingScreen />;
  if (!hasAccess) return <NotFound />;

  return <div>{/* Afficher la ressource */}</div>;
};
```

### Vérification manuelle

```typescript
import { useApp } from "../shared/contexts/AppContext";

const MyComponent = () => {
  const { state } = useApp();
  const hasCompany = !!state.currentCompany;

  if (!hasCompany) {
    // Rediriger vers la sélection de compagnie
  }
};
```

## Structure des Données

### Compagnie

```typescript
interface Company {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  icon?: LucideIcon;
  color?: string;
}
```

### État Global

```typescript
interface AppState {
  currentCompany: Company | null;
  globalError: ErrorSummary | null;
  // ... autres états
}
```

## Gestion des Erreurs

### Types d'erreurs

- **Compagnie non sélectionnée** : Redirection vers `/company-selection`
- **Accès refusé** : Redirection vers `/404`
- **Erreur de base de données** : Affichage d'un message d'erreur

### Récupération

- **Rechargement de page** : Récupération automatique des données
- **Changement de compagnie** : Réinitialisation de l'état
- **Déconnexion** : Nettoyage complet de l'état
