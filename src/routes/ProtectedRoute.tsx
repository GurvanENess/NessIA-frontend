import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../shared/components/LoadingScreen";
import { useApp } from "../shared/contexts/AppContext";
import { useAuth } from "../shared/contexts/AuthContext";

interface ProtectedRouteProps {
  redirectPath?: string;
  requireCompany?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
  requireCompany = false,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si authentifié mais pas de compagnie et qu'une compagnie est requise
  if (requireCompany && !state.currentCompany) {
    return <Navigate to="/company-selection" replace />;
  }

  // Si tout est OK, afficher le contenu
  return <Outlet />;
};

export default ProtectedRoute;
