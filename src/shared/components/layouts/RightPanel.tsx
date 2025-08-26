import React from "react";
import { useResizablePanel } from "../../hooks/useResizablePanel";
import { ResizeHandle } from "../ResizeHandle";

interface RightPanelProps {
  children: React.ReactNode;
  className?: string;
  onWidthChange?: (width: number) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  children,
  className = "",
  onWidthChange,
}) => {
  const { width, resizeHandlers } = useResizablePanel({
    initialWidth: 300,
    minWidth: 200,
    maxWidth: 800,
    onWidthChange,
  });

  return (
    <div className="relative overflow-y-auto custom-scrollbar">
      <div
        className={`bg-red-500 h-full p-5 overflow-y-auto ${className}`}
        style={{ width: `${width}px` }}
      >
        {/* Blocs de test pour l'overflow */}
        <div className="space-y-4">
          {/* Bloc 1 - Contenu court */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Bloc de test 1</h3>
            <p className="text-sm text-gray-600">
              Contenu court pour tester l'affichage normal.
            </p>
          </div>

          {/* Bloc 2 - Contenu moyen avec image */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Bloc de test 2</h3>
            <p className="text-sm text-gray-600 mb-3">
              Contenu moyen avec une image pour tester l'overflow vertical.
            </p>
            <div className="bg-gray-200 h-24 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">Image placeholder</span>
            </div>
          </div>

          {/* Bloc 3 - Contenu long pour forcer l'overflow */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Bloc de test 3</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ce bloc contient beaucoup de texte pour tester le comportement de
              l'overflow. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </p>
            <div className="space-y-2">
              <div className="bg-blue-100 p-2 rounded text-xs">Élément 1</div>
              <div className="bg-green-100 p-2 rounded text-xs">Élément 2</div>
              <div className="bg-yellow-100 p-2 rounded text-xs">Élément 3</div>
            </div>
          </div>

          {/* Bloc 4 - Formulaire de test */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Formulaire de test
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <textarea
                placeholder="Message"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
              />
            </div>
          </div>

          {/* Bloc 5 - Liste d'éléments */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Liste d'éléments
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Premier élément de la liste
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Deuxième élément de la liste
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Troisième élément de la liste
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Quatrième élément de la liste
              </li>
            </ul>
          </div>

          {/* Bloc 6 - Statistiques */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1.2k</div>
                <div className="text-xs text-gray-500">Vues</div>
              </div>
            </div>
          </div>

          {/* Bloc 7 - Actions rapides */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Actions rapides
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors">
                Créer un post
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors">
                Planifier
              </button>
              <button className="w-full bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition-colors">
                Analyser
              </button>
            </div>
          </div>

          {/* Bloc 8 - Contenu très long pour forcer l'overflow */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Contenu très long
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Ce bloc contient énormément de contenu pour tester les limites de
              l'overflow. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-xs text-gray-700">
                Zone de code ou de contenu spécial avec un fond différent pour
                tester la lisibilité et l'apparence générale dans le contexte de
                l'overflow.
              </p>
            </div>
          </div>

          {/* Bloc final pour s'assurer qu'il y a assez de contenu */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Bloc final</h3>
            <p className="text-sm text-gray-600">
              Ceci est le dernier bloc de test pour vérifier que l'overflow
              fonctionne correctement jusqu'au bout de la liste.
            </p>
          </div>
        </div>
      </div>
      <ResizeHandle onMouseDown={resizeHandlers.onMouseDown} />
    </div>
  );
};
