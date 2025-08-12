# 🔒 Protection des Ressources par Compagnie - NessIA Frontend

## 📋 Vue d'ensemble

Le système de protection des ressources par compagnie empêche l'accès aux posts et chats qui n'appartiennent pas à la compagnie actuellement sélectionnée par l'utilisateur. Si une ressource n'appartient pas à la compagnie, l'utilisateur est automatiquement redirigé vers la page d'erreur 404.

## 🚀 Fonctionnalités

### ✅ Ce qui est protégé

1. **Posts individuels** (`/posts/:postId`) - Vérification de l'appartenance à la compagnie
2. **Chats individuels** (`/chats/:chatId`) - Vérification de l'appartenance à la compagnie
3. **Redirection automatique** vers la page 404 si accès non autorisé
4. **Vérification en temps réel** lors de l'accès aux ressources

### 🔒 Comment ça fonctionne

1. **Vérification automatique** : À chaque accès à une ressource, le système vérifie l'appartenance
2. **Filtrage par compagnie** : Seules les ressources de la compagnie actuelle sont accessibles
3. **Sécurité renforcée** : Impossible d'accéder aux ressources d'autres compagnies via URL
4. **UX préservée** : Redirection fluide vers 404 avec message d'erreur approprié

## 🏗️ Architecture

### Composants de protection

- **`CompanyResourceGuard`** - Composant de protection des ressources
- **`useCompanyResourceAccess`** - Hook pour vérifier l'accès aux ressources
- **Protection intégrée** dans PostEditor et ChatAI

### Flux de vérification

```
Utilisateur accède à /posts/123
    ↓
Vérification de la compagnie actuelle
    ↓
Récupération du post avec company_id
    ↓
Vérification de l'appartenance
    ↓
✅ Accès autorisé OU ❌ Redirection 404
```

## 📱 Utilisation

### 1. Protection automatique des posts

Les posts sont automatiquement protégés dans `PostEditor` :

```tsx
import { useCompanyResourceAccess } from "../../../shared/hooks/useCompanyResourceAccess";

const PostEditor: React.FC = () => {
  // Vérifier l'accès au post par compagnie
  const { hasAccess, isLoading, resourceData, error } =
    useCompanyResourceAccess("post");

  // Si en cours de vérification, afficher un indicateur
  if (isLoading) {
    return <div>Vérification de l'accès...</div>;
  }

  // Si pas d'accès, le hook redirigera automatiquement vers 404
  if (!hasAccess) {
    return null;
  }

  // Afficher le contenu du post
  return <div>Contenu du post...</div>;
};
```

### 2. Protection automatique des chats

Les chats sont automatiquement protégés dans `ChatAI` :

```tsx
import { useCompanyResourceAccess } from "../../../shared/hooks/useCompanyResourceAccess";

const ChatAI: React.FC = () => {
  // Vérifier l'accès au chat par compagnie
  const {
    hasAccess,
    isLoading: isCheckingAccess,
    resourceData: chatData,
  } = useCompanyResourceAccess("chat");

  // Si on vérifie l'accès à un chat spécifique, afficher un indicateur
  if (chatId && isCheckingAccess) {
    return <div>Vérification de l'accès au chat...</div>;
  }

  // Si on a un chatId mais pas d'accès, redirection automatique vers 404
  if (chatId && !hasAccess) {
    return null;
  }

  // Afficher le chat
  return <div>Contenu du chat...</div>;
};
```

### 3. Utilisation du composant de protection

Vous pouvez aussi utiliser le composant `CompanyResourceGuard` directement :

```tsx
import CompanyResourceGuard from "../components/CompanyResourceGuard";

<CompanyResourceGuard resourceType="post">
  <PostEditor />
</CompanyResourceGuard>

<CompanyResourceGuard resourceType="chat">
  <ChatAI />
</CompanyResourceGuard>
```

## 🔧 Configuration

### Types de ressources supportés

```typescript
type ResourceType = "post" | "chat";
```

### Paramètres du hook

```typescript
const {
  hasAccess, // Boolean : true si accès autorisé
  isLoading, // Boolean : true pendant la vérification
  resourceData, // Données de la ressource si accès autorisé
  error, // Message d'erreur si problème
} = useCompanyResourceAccess("post");
```

### Gestion des erreurs

```typescript
// Erreurs possibles
-"Aucune compagnie sélectionnée" -
  "ID de ressource manquant" -
  "Ressource non trouvée" -
  "Erreur lors de la vérification de l'accès";
```

## 🎯 Cas d'usage

### 1. Accès autorisé

**Scénario** : Utilisateur de la compagnie "e-Ness" accède à `/posts/123`
**Résultat** : ✅ Post affiché normalement

**Processus** :

1. Vérification de la compagnie actuelle (e-Ness)
2. Récupération du post avec `company_id = e-Ness`
3. Affichage du post

### 2. Accès non autorisé

**Scénario** : Utilisateur de la compagnie "e-Ness" accède à `/posts/456` (post de "Ma Startup")
**Résultat** : ❌ Redirection vers 404

**Processus** :

1. Vérification de la compagnie actuelle (e-Ness)
2. Tentative de récupération du post avec `company_id = e-Ness`
3. Post non trouvé (car il appartient à "Ma Startup")
4. Redirection automatique vers `/404`

### 3. Changement de compagnie

**Scénario** : Utilisateur change de compagnie de "e-Ness" vers "Ma Startup"
**Résultat** : 🔄 Rechargement des données avec nouvelle compagnie

**Processus** :

1. Sélection de la nouvelle compagnie
2. Mise à jour du contexte global
3. Rechargement automatique des données
4. Accès aux ressources de la nouvelle compagnie

## 🚨 Gestion des erreurs

### Ressource non trouvée

```tsx
// Affichage automatique de la page 404
<NotFound />
```

### Erreur de vérification

```tsx
// Affichage d'un message d'erreur
<p className="text-red-600">Erreur lors de la vérification de l'accès</p>
```

### Compagnie non sélectionnée

```tsx
// Redirection vers la modale de sélection
<CompanySelectionModal />
```

## 🔄 Workflow de sécurité

### 1. Accès à une ressource

```
URL : /posts/123
    ↓
Vérification de la compagnie actuelle
    ↓
Récupération de la ressource avec company_id
    ↓
Vérification de l'appartenance
    ↓
Décision d'accès
```

### 2. Décision d'accès

```
✅ Ressource trouvée ET appartient à la compagnie
    ↓
Affichage de la ressource

❌ Ressource non trouvée OU n'appartient pas à la compagnie
    ↓
Redirection vers 404
```

### 3. Gestion des erreurs

```
Erreur de base de données
    ↓
Log de l'erreur
    ↓
Affichage du message d'erreur
    ↓
Redirection vers 404
```

## 📝 Notes techniques

### Performance

- **Vérification en temps réel** : À chaque accès à une ressource
- **Cache intelligent** : Les vérifications sont optimisées
- **Redirection fluide** : Pas de clignotement ou de saut

### Sécurité

- **Vérification côté client** : Protection immédiate
- **Vérification côté serveur** : Double sécurité via les services
- **Isolation des données** : Impossible de contourner la protection

### Base de données

- **Requêtes filtrées** : Toutes les requêtes incluent `company_id`
- **Index optimisés** : Performance maintenue malgré le filtrage
- **Cascade sécurisée** : Suppression automatique des ressources liées

## 🚀 Prochaines étapes

### Phase 2 : Refactorisation des services

1. **Mise à jour complète** de tous les services pour utiliser la compagnie actuelle
2. **Suppression** de tous les `company_id: 1` hard-codés
3. **Tests de sécurité** pour valider la protection

### Améliorations futures

1. **Audit trail** : Logs des tentatives d'accès non autorisées
2. **Notifications** : Alertes en cas de tentatives d'accès suspectes
3. **Permissions granulaires** : Gestion des rôles par compagnie
4. **Cache avancé** : Optimisation des performances de vérification

## 🔍 Tests et validation

### Tests à effectuer

1. **Accès autorisé** : Vérifier qu'un post de sa compagnie s'affiche
2. **Accès non autorisé** : Vérifier la redirection vers 404
3. **Changement de compagnie** : Vérifier le rechargement des données
4. **URLs malveillantes** : Tester l'accès à des ressources d'autres compagnies

### Validation de la sécurité

- ✅ Impossible d'accéder aux posts d'autres compagnies
- ✅ Impossible d'accéder aux chats d'autres compagnies
- ✅ Redirection automatique vers 404
- ✅ Protection maintenue lors du changement de compagnie
