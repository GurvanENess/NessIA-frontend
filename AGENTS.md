# Instructions pour l'IA

Ce projet suit une architecture modulaire orientée pages. Chaque page de `src/pages/<page>` peut contenir plusieurs strates pour séparer clairement les responsabilités :

## Stack technique :

- Typescript
- React
- Tailwind CSS
- React Router

## Architecture des Pages

- **`entities/`** : définit les types et modèles de domaine utilisés par la page.
- **`services/`** : contient la logique métier et les appels aux API propres à la page.
- **`store/`** : gère l'état local de la page, souvent à l'aide d'un reducer React.
- **`components/`** : regroupe les composants React liés à l'interface de cette page.

Respecter l'isolation des responsabilités est primordial. La logique UI, la logique métier et le typage doivent rester distincts afin de garder un code maintenable.

Tout code mutualisé ou transversal au projet doit être placé dans `src/shared/` (ex. hooks, contextes, utilitaires, stores communs...). Le code spécifique à une page doit rester dans `src/pages/<page>/` en suivant la structure précédente. Cette structure peut s'assouplir et accueillir d'autres dossiers au besoin (par exemple `hooks`, `contexts`, `utils`, etc.), tant que la séparation des responsabilités reste claire.
