# ImagePreview Component

Un composant React réutilisable pour afficher des images avec fonctionnalités avancées comme le zoom modal, la suppression, et le drag & drop.

## Utilisation de base

```tsx
import ImagePreview from "../shared/components/ImagePreview";

// Affichage simple avec modal de zoom
<ImagePreview src="/path/to/image.jpg" alt="Description de l'image" />;
```

## Props disponibles

### Props principales

- `src` (string, requis) : URL de l'image à afficher
- `alt` (string, optionnel) : Texte alternatif pour l'image
- `className` (string, optionnel) : Classes CSS personnalisées pour l'image
- `containerClassName` (string, optionnel) : Classes CSS pour le conteneur

### Tailles

- `size` : "sm" | "md" | "lg" | "auto" (défaut: "md")
  - `sm`: 64x64px (16x16 Tailwind)
  - `md`: 80x80px (20x20 Tailwind)
  - `lg`: 96x96px (24x24 Tailwind)
  - `auto`: Prend toute la taille du conteneur

### Fonctionnalités

- `showZoomIcon` (boolean, défaut: true) : Afficher l'icône de zoom au hover
- `disableModal` (boolean, défaut: false) : Désactiver le modal de zoom
- `onClick` (function, optionnel) : Fonction appelée quand l'image est cliquée

### Suppression

- `showDeleteButton` (boolean, défaut: false) : Afficher le bouton de suppression
- `onDelete` (function, optionnel) : Fonction appelée lors de la suppression

### Drag & Drop

- `draggable` (boolean, défaut: false) : Permettre le drag & drop
- `dragIndex` (number, optionnel) : Index pour les opérations de drag & drop
- `onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`, `onDragEnd` : Handlers drag & drop
- `isDragging` (boolean, défaut: false) : Indiquer si l'élément est en cours de drag
- `isDragOver` (boolean, défaut: false) : Indiquer si l'élément est survolé pendant un drag

## Exemples d'usage

### 1. Usage simple dans le chat

```tsx
<ImagePreview
  src={messageImage.url}
  alt="Image du message"
  size="sm"
  containerClassName="shadow-sm"
/>
```

### 2. Galerie avec suppression

```tsx
{
  images.map((image, index) => (
    <ImagePreview
      key={image.id}
      src={image.url}
      alt={image.alt}
      size="md"
      showDeleteButton={true}
      onDelete={() => handleDelete(image.id)}
    />
  ));
}
```

### 3. Grille avec drag & drop (comme dans MediaSection)

```tsx
<ImagePreview
  src={image.url}
  alt={`Image ${index + 1}`}
  size="md"
  showDeleteButton={true}
  onDelete={() => handleRemoveImage(index)}
  draggable={true}
  dragIndex={index}
  onDragStart={handleImageDragStart}
  onDragOver={handleImageDragOver}
  onDragLeave={handleImageDragLeave}
  onDrop={handleImageDrop}
  onDragEnd={handleImageDragEnd}
  isDragging={draggedIndex === index}
  isDragOver={dragOverIndex === index}
/>
```

### 4. Image responsive sans modal

```tsx
<div className="w-full h-48 overflow-hidden rounded-lg">
  <ImagePreview
    src={image.url}
    alt="Image responsive"
    size="auto"
    disableModal={true}
    showZoomIcon={false}
  />
</div>
```

## Animations

Le composant inclut des animations CSS pour :

- Fondu d'entrée du modal (fadeInBackdrop)
- Zoom d'entrée de l'image (scaleInImage)
- Apparition du bouton de fermeture (fadeInButton)
- Transitions hover sur l'overlay et les boutons

## Intégration

Le composant est utilisé dans :

- `MediaSection` : pour l'édition de posts avec fonctionnalités complètes
- `ChatImageMessage` : pour l'affichage d'images dans les messages de chat
- Peut être utilisé partout où un affichage d'image avec zoom est nécessaire

## Dépendances

- React
- Lucide React (icônes X et ZoomIn)
- Tailwind CSS (pour les styles)


