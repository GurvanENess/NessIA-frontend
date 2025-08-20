import { ExternalLink, Facebook } from "lucide-react";
import React from "react";

const ConnectorsTab: React.FC = () => {
  const handleConnect = () => {
    // Fonctionnalité à venir - pour l'instant rien ne se passe
    console.log("Connexion Meta - fonctionnalité à venir");
  };

  const handleBrowseConnectors = () => {
    // Fonctionnalité à venir - pour l'instant rien ne se passe
    console.log("Parcourir les connecteurs - fonctionnalité à venir");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-coolvetica font-semibold text-gray-900 mb-4">
          Connecteurs
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Permettez à Nessia de faire référence à d'autres applications et
          services pour plus de contexte.
        </p>
      </div>

      {/* Connectors List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Meta Connector */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Facebook className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Meta</h3>
                <p className="text-sm text-gray-500">Déconnecté</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED] hover:text-white transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Connecter
            </button>
          </div>

          {/* Additional connectors can be added here */}
          <div className="text-center py-8">
            <button
              onClick={handleBrowseConnectors}
              className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-medium"
            >
              Parcourir les connecteurs
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note :</strong> La fonctionnalité de connexion OAuth sera
          implémentée prochainement. Les boutons sont cliquables mais n'ont pas
          encore de logique.
        </p>
      </div>
    </div>
  );
};

export default ConnectorsTab;
