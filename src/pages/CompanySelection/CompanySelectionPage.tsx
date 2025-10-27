import { motion } from "framer-motion";
import { AlertCircle, Building2, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../shared/contexts/AppContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import { db } from "../../shared/services/db";
import { Company } from "../../shared/store/AppReducer";
import { logger } from "../../shared/utils/logger";

const CompanySelectionPage: React.FC = () => {
  const { setCurrentCompany } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        setError(null);
        const userCompanies = await db.getCompaniesByUserId(user.id);
        setCompanies(userCompanies);
      } catch (err) {
        logger.error("Failed to load companies", err);
        setError("Impossible de charger vos compagnies. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCompanies();
  }, [user?.id]);

  const handleCompanySelect = (company: Company) => {
    setCurrentCompany(company);
    // Rediriger vers la page d'accueil après sélection
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Chargement de vos compagnies...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucune compagnie disponible
          </h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de compagnie associée à votre compte.
          </p>
          <button
            onClick={() => navigate("/logout")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choisissez votre compagnie
          </h1>
          <p className="text-gray-600">
            Sélectionnez la compagnie avec laquelle vous souhaitez travailler
          </p>
        </div>

        {/* Liste des compagnies */}
        <div className="space-y-3">
          {companies.map((company) => {
            const IconComponent = company.icon || Building2;
            return (
              <motion.button
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-[#7C3AED] hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center group-hover:bg-[#7C3AED]/20 transition-colors">
                    <IconComponent className="w-6 h-8 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                      {company.name}
                    </h3>
                    {company.email && (
                      <p className="text-sm text-gray-500">{company.email}</p>
                    )}
                  </div>
                  <div className="w-6 h-6 bg-[#7C3AED]/10 rounded-full flex items-center justify-center group-hover:bg-[#7C3AED]/20 transition-colors">
                    <Check className="w-4 h-4 text-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Vous pouvez changer de compagnie à tout moment depuis votre profil
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanySelectionPage;
