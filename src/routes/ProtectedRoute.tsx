import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../shared/components/LoadingScreen";
import { useAppStore } from "../shared/store/appStore";
import { useAuthStore } from "../shared/store/authStore";

interface ProtectedRouteProps {
  redirectPath?: string;
  requireCompany?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
  requireCompany = false,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const currentCompany = useAppStore((s) => s.currentCompany);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si authentifié mais pas de compagnie et qu'une compagnie est requise
  if (requireCompany && !currentCompany) {
    return <Navigate to="/company-selection" replace />;
  }

  // Si tout est OK, afficher le contenu
  return <Outlet />;
};

export default ProtectedRoute;
