import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { db } from "../services/db";
import { logger } from "../utils/logger";

interface UseCompanyResourceAccessReturn {
  hasAccess: boolean;
  isLoading: boolean;
  resourceData: any | null;
  error: string | null;
}

/**
 * Hook pour vérifier l'accès aux ressources (posts/chats) par compagnie
 * Redirige vers 404 si la ressource n'appartient pas à la compagnie actuelle
 */
export const useCompanyResourceAccess = (
  resourceType: "post" | "chat"
): UseCompanyResourceAccessReturn => {
  const { state } = useApp();
  const { postId, chatId } = useParams<{ postId?: string; chatId?: string }>();
  const navigate = useNavigate();

  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceData, setResourceData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkResourceAccess = async () => {
      // Si on n'a pas de paramètre (page d'accueil), on autorise l'accès
      if (!postId && !chatId) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      if (!state.currentCompany?.id) {
        setHasAccess(false);
        setError("Aucune compagnie sélectionnée");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        let data;

        if (resourceType === "post" && postId) {
          data = await db.getPostById(postId, state.currentCompany.id);
        } else if (resourceType === "chat" && chatId) {
          data = await db.getChatById(chatId, state.currentCompany.id);
        } else {
          setError("ID de ressource manquant");
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        if (data) {
          setResourceData(data);
          setHasAccess(true);
        } else {
          setHasAccess(false);
          setError("Ressource non trouvée");
        }
      } catch (err) {
        logger.error(`Error checking ${resourceType} access`, err);
        setHasAccess(false);
        setError("Erreur lors de la vérification de l'accès");
      } finally {
        setIsLoading(false);
      }
    };

    checkResourceAccess();
  }, [resourceType, postId, chatId, state.currentCompany?.id]);

  // Rediriger vers 404 si pas d'accès (après le chargement)
  useEffect(() => {
    if (!isLoading && !hasAccess) {
      // Utiliser un timeout pour éviter les boucles de redirection
      const timeoutId = setTimeout(() => {
        navigate("/404", { replace: true });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, hasAccess, navigate]);

  return {
    hasAccess,
    isLoading,
    resourceData,
    error,
  };
};

export default useCompanyResourceAccess;
