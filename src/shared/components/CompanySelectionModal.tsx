import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, User, AlertCircle } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/db";
import { Company } from "../store/AppReducer";

const CompanySelectionModal: React.FC = () => {
  const { state, setCurrentCompany } = useApp();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les compagnies de l'utilisateur
  useEffect(() => {
    const loadCompanies = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const userCompanies = await db.getCompaniesByUserId(user.id);
        setCompanies(userCompanies);
      } catch (err) {
        console.error("Failed to load companies:", err);
        setError("Impossible de charger vos compagnies. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [user?.id]);

  // Si une compagnie est déjà sélectionnée, ne pas afficher la modale
  if (state.currentCompany) {
    return null;
  }

  const handleCompanySelect = (company: Company) => {
    setCurrentCompany(company);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Sélectionnez votre compagnie
            </h2>
            <p className="text-purple-100 text-sm">
              Choisissez la compagnie avec laquelle vous souhaitez travailler
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de vos compagnies...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Aucune compagnie trouvée</p>
                <p className="text-gray-500 text-sm">
                  Contactez votre administrateur pour ajouter une compagnie
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600 text-sm mb-4">
                  Vous devez sélectionner une compagnie pour continuer
                </p>

                {companies.map((company) => {
                  const IconComponent = company.icon || Building2;

                  return (
                    <button
                      key={company.id}
                      onClick={() => handleCompanySelect(company)}
                      className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#7C3AED] hover:bg-purple-50 transition-all group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${
                          company.color || "bg-[#7C3AED]"
                        } flex items-center justify-center flex-shrink-0`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                          {company.name}
                        </h3>
                        {company.email && (
                          <p className="text-sm text-gray-500">
                            {company.email}
                          </p>
                        )}
                      </div>

                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-[#7C3AED] transition-colors flex-shrink-0"></div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isLoading && !error && companies.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Cette sélection sera sauvegardée pour vos prochaines sessions
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanySelectionModal;
