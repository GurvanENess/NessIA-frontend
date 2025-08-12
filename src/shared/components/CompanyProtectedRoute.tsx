import React from "react";
import { useApp } from "../contexts/AppContext";
import CompanySelectionModal from "./CompanySelectionModal";

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const CompanyProtectedRoute: React.FC<CompanyProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { state } = useApp();

  // Si aucune compagnie n'est sélectionnée, afficher la modale
  if (!state.currentCompany) {
    return (
      <>
        <CompanySelectionModal />
        {fallback || (
          <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Compagnie requise
              </h2>
              <p className="text-gray-600">
                Veuillez sélectionner une compagnie pour accéder à cette page
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Si une compagnie est sélectionnée, afficher le contenu
  return <>{children}</>;
};

export default CompanyProtectedRoute;
