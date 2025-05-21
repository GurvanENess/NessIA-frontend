import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

interface PublicRouteProps {
  redirectPath?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ redirectPath = "/" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Outlet />;
};

export default PublicRoute;
