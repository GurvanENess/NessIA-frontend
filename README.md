# Documentation du projet

Ce dépôt contient l'interface web de NessIA, réalisée avec des outils modernes autour de React et TypeScript.

## Technologies principales

- **React 18** et **TypeScript** pour la structure de l'application et le typage.
- **Vite** pour le bundling et le serveur de développement.
- **React Router v6** pour la navigation côté client.
- **Tailwind CSS** pour le style via des classes utilitaires.
- **Supabase** pour l'authentification et la persistance des données.
- **Axios** pour les requêtes HTTP.
- **Framer Motion** pour les animations.
- **Lucide React** pour les icônes.
- **date-fns** pour la manipulation des dates.
- **ESLint** afin d'assurer la cohérence du code.

## Organisation du code

- `src/components` : composants réutilisables et mises en page.
- `src/pages` : pages correspondant aux routes de l'application.
- `src/contexts` : contextes React et logique de gestion d'état via `useReducer`.
- `src/hooks` : hooks personnalisés, notamment la logique de chat IA.
- `src/api` : clients d'API (Supabase et serveur IA fictif).
- `src/utils` : fonctions utilitaires et configuration du rendu Markdown.

Les fichiers TypeScript permettent un typage strict, tandis que Tailwind assure un design responsive. Les animations sont gérées via Framer Motion et l'authentification s'appuie sur Supabase.

## Méthodologies de travail

- Utilisation de **Git** pour le versionnement et la collaboration.
- Structure basée sur des composants fonctionnels et des hooks.
- Linting avec ESLint pour maintenir une base de code homogène.
- Préparation d'un dossier `tests` pour accueillir des tests unitaires (encore peu implémentés).
- Découpage clair en répertoires (`components`, `pages`, `contexts`, etc.) pour isoler les responsabilités.

## Défauts potentiels

Le projet étant en développement, certaines limites sont visibles :

- Redondances de logique entre certains composants et contextes.
- Couplage fort de certaines pages avec les contextes globaux.
- Flux de données parfois difficiles à suivre ou incohérents.
- Peu ou pas de tests automatisés, ce qui complique la validation des régressions.
- Quelques `TODO` et fonctionnalités incomplètes (sauvegarde et publication des posts, par exemple).

Ces points devront être améliorés pour obtenir une base de code plus robuste et maintenable.
