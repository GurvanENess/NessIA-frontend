import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../shared/contexts/AuthContext";
import LoadingScreen from "../shared/components/LoadingScreen";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
