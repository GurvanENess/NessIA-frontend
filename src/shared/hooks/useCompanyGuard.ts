import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";

/**
 * Hook pour protéger les composants nécessitant une compagnie sélectionnée
 * Redirige vers la page d'accueil si aucune compagnie n'est sélectionnée
 */
export const useCompanyGuard = () => {
  const { state } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est authentifié mais qu'aucune compagnie n'est sélectionnée
    if (isAuthenticated && !state.currentCompany) {
      // Rediriger vers la page d'accueil où la modale s'affichera
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, state.currentCompany, navigate]);

  return {
    hasCompany: !!state.currentCompany,
    currentCompany: state.currentCompany,
  };
};

export default useCompanyGuard;
