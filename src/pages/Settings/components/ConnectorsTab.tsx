import { ExternalLink, Facebook, Instagram } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useApp } from "../../../shared/contexts/AppContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { logger } from "../../../shared/utils/logger";
import { PlatformsService } from "../services/platformsService";

const ConnectorsTab: React.FC = () => {
  const { state, refreshCurrentCompany } = useApp();
  const { currentCompany } = state;
  const { user } = useAuth();

  const connectedPlatforms = currentCompany?.platforms ?? [];

  // Recharger les plateformes au montage du composant
  useEffect(() => {
    const loadPlatforms = async () => {
      if (!user?.id) return;

      try {
        await refreshCurrentCompany(user.id);
      } catch (error) {
        logger.error("Failed to refresh platforms", error);
        // On n'affiche pas d'erreur à l'utilisateur car ce n'est pas bloquant
      }
    };

    loadPlatforms();
  }, [user?.id]); // On recharge uniquement quand l'utilisateur change

  const handleConnect = async () => {
    const url = await PlatformsService.getConnectionUrl(
      currentCompany?.id || "",
      user?.token || ""
    );
    if (url) {
      window.location.href = url;
    } else {
      toast.error("Impossible de se connecter à cette plateforme");
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Facebook className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Facebook</h3>
                <p className="text-sm text-gray-500">
                  {connectedPlatforms.find(
                    (platform) => platform.platform_name === "facebook"
                  )?.account_name || "Déconnecté"}
                </p>
              </div>
            </div>
            <div className="flex justify-start sm:justify-end">
              {connectedPlatforms.find(
                (platform) => platform.platform_name === "facebook"
              ) ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDE9FE] text-[#6D28D9] rounded-full text-xs font-medium">
                  <svg
                    className="w-4 h-4 text-[#7C3AED]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Connecté
                </span>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED] hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" target="_blank" />
                  Connecter
                </button>
              )}
            </div>
          </div>
          {/* Instagram Connector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Instagram className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Instagram</h3>
                <p className="text-sm text-gray-500">
                  {connectedPlatforms.find(
                    (platform) => platform.platform_name === "instagram"
                  )?.account_name || "Déconnecté"}
                </p>
              </div>
            </div>
            <div className="flex justify-start sm:justify-end">
              {connectedPlatforms.find(
                (platform) => platform.platform_name === "instagram"
              ) ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EDE9FE] text-[#6D28D9] rounded-full text-xs font-medium">
                  <svg
                    className="w-4 h-4 text-[#7C3AED]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Connecté
                </span>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] rounded-lg hover:bg-[#7C3AED] hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" target="_blank" />
                  Connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectorsTab;
