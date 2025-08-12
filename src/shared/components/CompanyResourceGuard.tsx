import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { db } from "../services/db";
import NotFound from "./errors/NotFound";

interface CompanyResourceGuardProps {
  children: React.ReactNode;
  resourceType: "post" | "chat";
  fallback?: React.ReactNode;
}

const CompanyResourceGuard: React.FC<CompanyResourceGuardProps> = ({
  children,
  resourceType,
  fallback,
}) => {
  const { state } = useApp();
  const { postId, chatId } = useParams<{ postId?: string; chatId?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [resourceExists, setResourceExists] = useState(false);

  useEffect(() => {
    const checkResourceAccess = async () => {
      if (!state.currentCompany?.id) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        let resourceData;

        if (resourceType === "post" && postId) {
          // Vérifier l'accès au post
          resourceData = await db.getPostById(postId, state.currentCompany.id);
          setResourceExists(!!resourceData);
          setHasAccess(!!resourceData);
        } else if (resourceType === "chat" && chatId) {
          // Vérifier l'accès au chat
          resourceData = await db.getChatById(chatId, state.currentCompany.id);
          setResourceExists(!!resourceData);
          setHasAccess(!!resourceData);
        } else {
          setHasAccess(false);
          setResourceExists(false);
        }
      } catch (error) {
        console.error(`Error checking ${resourceType} access:`, error);
        setHasAccess(false);
        setResourceExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkResourceAccess();
  }, [resourceType, postId, chatId, state.currentCompany?.id]);

  // Si en cours de chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E7E9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  // Si la ressource n'existe pas ou n'appartient pas à la compagnie, afficher 404
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <NotFound />;
  }

  // Si l'accès est autorisé, afficher le contenu
  return <>{children}</>;
};

export default CompanyResourceGuard;
