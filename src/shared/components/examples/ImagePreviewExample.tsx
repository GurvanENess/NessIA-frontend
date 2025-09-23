import React from "react";
import ImagePreview from "../ImagePreview";

/**
 * Exemple d'utilisation du composant ImagePreview
 * Ce fichier démontre différents usages possibles
 */

const ImagePreviewExample: React.FC = () => {
  const sampleImages = [
    {
      id: "1",
      url: "/assets/default.jpg",
      alt: "Image d'exemple 1",
    },
    {
      id: "2",
      url: "/assets/default.jpg",
      alt: "Image d'exemple 2",
    },
  ];

  const handleImageDelete = (imageId: string) => {
    console.log("Suppression de l'image:", imageId);
    // Logique de suppression
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Exemples d'utilisation ImagePreview
      </h2>

      {/* Usage simple - juste affichage avec modal */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          1. Affichage simple avec modal de zoom
        </h3>
        <div className="flex gap-4">
          <ImagePreview
            src="/assets/default.jpg"
            alt="Image simple"
            size="md"
          />
        </div>
      </div>

      {/* Usage pour le chat - petites images inline */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          2. Usage pour le chat (petites images)
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800 mb-2">
            Voici mon message avec des images :
          </p>
          <div className="flex gap-2 mt-2">
            {sampleImages.map((image) => (
              <ImagePreview
                key={image.id}
                src={image.url}
                alt={image.alt}
                size="sm"
                showZoomIcon={true}
                containerClassName="shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Usage avec suppression */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          3. Avec boutons de suppression
        </h3>
        <div className="flex gap-4">
          {sampleImages.map((image) => (
            <ImagePreview
              key={image.id}
              src={image.url}
              alt={image.alt}
              size="lg"
              showDeleteButton={true}
              onDelete={() => handleImageDelete(image.id)}
            />
          ))}
        </div>
      </div>

      {/* Usage sans modal */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          4. Sans modal de zoom
        </h3>
        <div className="flex gap-4">
          <ImagePreview
            src="/assets/default.jpg"
            alt="Image sans modal"
            size="md"
            disableModal={true}
            showZoomIcon={false}
            onClick={() => console.log("Image cliquée")}
          />
        </div>
      </div>

      {/* Usage responsive/auto */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          5. Taille automatique (responsive)
        </h3>
        <div className="w-48 h-32 border border-gray-300 rounded-lg overflow-hidden">
          <ImagePreview
            src="/assets/default.jpg"
            alt="Image responsive"
            size="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewExample;


