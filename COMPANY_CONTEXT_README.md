# 🏢 Contexte de Compagnie - NessIA Frontend

## 📋 Vue d'ensemble

Le contexte de compagnie permet de gérer la compagnie actuellement sélectionnée par l'utilisateur dans l'application. Cette fonctionnalité est **obligatoire** pour utiliser l'application.

## 🚀 Fonctionnalités

### ✅ Ce qui est implémenté (Phase 1)

1. **Sélection de compagnie** via le dropdown utilisateur
2. **Persistance** de la sélection dans localStorage
3. **Modale obligatoire** si aucune compagnie n'est sélectionnée
4. **Protection des routes** nécessitant une compagnie
5. **State global** synchronisé entre tous les composants

### 🔄 Ce qui sera implémenté (Phase 2)

1. **Refactorisation des services** pour utiliser la compagnie actuelle
2. **Filtrage automatique** des données par compagnie
3. **Rechargement des données** lors du changement de compagnie

## 🏗️ Architecture

### Composants principaux

- **`CompanySelectionModal`** - Modale obligatoire pour sélectionner une compagnie
- **`CompanyProtectedRoute`** - Composant de protection des routes
- **`UserAccountDropdown`** - Dropdown pour changer de compagnie
- **`useCompanyGuard`** - Hook pour protéger les composants

### Contexte

- **`AppContext`** - Gère l'état global de la compagnie
- **`AppReducer`** - Actions et state management

## 📱 Utilisation

### 1. Sélection automatique après connexion

Après la connexion, si aucune compagnie n'est sélectionnée, une modale s'affiche automatiquement :

```tsx
// La modale s'affiche automatiquement dans AppLayout
<CompanySelectionModal />
```

### 2. Protection des composants

Utilisez le hook `useCompanyGuard` pour protéger vos composants :

```tsx
import { useCompanyGuard } from "../hooks/useCompanyGuard";

const MonComposant = () => {
  const { hasCompany, currentCompany } = useCompanyGuard();

  if (!hasCompany) {
    return <div>Redirection en cours...</div>;
  }

  return (
    <div>
      <h1>Bienvenue dans {currentCompany.name}</h1>
      {/* Votre contenu protégé */}
    </div>
  );
};
```

### 3. Protection des routes

Enveloppez vos routes avec `CompanyProtectedRoute` :

```tsx
import CompanyProtectedRoute from "../components/CompanyProtectedRoute";

<CompanyProtectedRoute>
  <MonComposant />
</CompanyProtectedRoute>;
```

### 4. Accès au contexte

Utilisez le hook `useApp` pour accéder à la compagnie actuelle :

```tsx
import { useApp } from "../contexts/AppContext";

const MonComposant = () => {
  const { state, setCurrentCompany, clearCurrentCompany } = useApp();

  return (
    <div>
      <p>Compagnie actuelle : {state.currentCompany?.name}</p>
      <button onClick={() => clearCurrentCompany()}>
        Changer de compagnie
      </button>
    </div>
  );
};
```

## 🔧 Configuration

### Structure de la compagnie

```typescript
interface Company {
  id: string;
  name: string;
  email?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}
```

### Actions disponibles

```typescript
// Définir une compagnie
dispatch({ type: "SET_CURRENT_COMPANY", payload: company });

// Effacer la sélection
dispatch({ type: "CLEAR_CURRENT_COMPANY" });
```

### Méthodes du contexte

```typescript
const {
  setCurrentCompany,    // Sélectionner une compagnie
  clearCurrentCompany,  // Effacer la sélection
  state.currentCompany  // Compagnie actuelle
} = useApp();
```

## 🎯 Cas d'usage

### 1. Page d'accueil

- ✅ Modale s'affiche si aucune compagnie
- ✅ Utilisateur doit sélectionner une compagnie
- ✅ Redirection automatique après sélection

### 2. Pages protégées

- ✅ Vérification automatique de la compagnie
- ✅ Redirection si aucune compagnie sélectionnée
- ✅ Affichage du contenu si compagnie OK

### 3. Changement de compagnie

- ✅ Dropdown utilisateur pour changer
- ✅ Persistance automatique
- ✅ Synchronisation immédiate

## 🚨 Gestion des erreurs

### Aucune compagnie trouvée

```tsx
// La modale affiche un message d'erreur
<p className="text-gray-600 mb-2">Aucune compagnie trouvée</p>
<p className="text-gray-500 text-sm">
  Contactez votre administrateur pour ajouter une compagnie
</p>
```

### Erreur de chargement

```tsx
// Bouton de retry disponible
<button onClick={() => window.location.reload()}>Réessayer</button>
```

## 🔄 Workflow utilisateur

1. **Connexion** → Utilisateur se connecte
2. **Vérification** → AppContext vérifie s'il y a une compagnie
3. **Modale** → Si aucune compagnie, modale s'affiche
4. **Sélection** → Utilisateur sélectionne une compagnie
5. **Persistance** → Sélection sauvegardée dans localStorage
6. **Accès** → Utilisateur peut maintenant utiliser l'application
7. **Changement** → Possibilité de changer via le dropdown

## 📝 Notes techniques

- **localStorage key** : `nessia_current_company`
- **Z-index modale** : `z-50`
- **Animation** : Framer Motion avec spring physics
- **Responsive** : Adapté mobile et desktop
- **Accessibilité** : Support clavier et focus management

## 🚀 Prochaines étapes

1. **Tester** la sélection de compagnie
2. **Valider** la persistance localStorage
3. **Implémenter** la refactorisation des services (Phase 2)
4. **Ajouter** des tests unitaires
5. **Documenter** les cas d'usage avancés
