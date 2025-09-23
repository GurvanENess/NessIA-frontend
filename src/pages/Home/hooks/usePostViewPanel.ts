import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../shared/contexts/AppContext";
import { PostData } from "../../../shared/entities/PostTypes";
import { db } from "../../../shared/services/db";
import { logger } from "../../../shared/utils/logger";
import {
  convertSupabasePost,
  SupabasePost,
} from "../../../shared/utils/postUtils";
import { Post } from "../../Posts/entities/PostTypes";

/**
 * Hook pour gérer l'état et les actions du panneau de visualisation des posts
 *
 * Ce hook centralise :
 * - La récupération des données du post
 * - La synchronisation avec l'URL
 * - Les actions de modification/suppression
 *
 */
export const usePostViewPanel = () => {
  const { state, dispatch } = useApp();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // === ÉTATS LOCAUX ===
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "edit" | "schedule">(
    "preview"
  );

  // === COMPUTED VALUES ===
  const postId = state.postPanel.postId || "";
  const isPostRoute = location.pathname.includes("/post");
  const shouldPanelBeOpen = isPostRoute;

  // === SYNCHRONISATION URL ↔ ÉTAT ===
  useEffect(() => {
    if (shouldPanelBeOpen && !state.postPanel.isOpen) {
      dispatch({ type: "OPEN_POST_PANEL", payload: postId });
    } else if (!shouldPanelBeOpen && state.postPanel.isOpen) {
      dispatch({ type: "CLOSE_POST_PANEL" });
    }
  }, [shouldPanelBeOpen, state.postPanel.isOpen, dispatch]);

  // === RÉCUPÉRATION DES DONNÉES ===
  useEffect(() => {
    const fetchPost = async () => {
      // Utiliser postId de l'URL ou celui du state en fallback
      let targetPostId = state.postPanel.postId;

      if (!targetPostId && chatId && isPostRoute) {
        try {
          const chatData = await db.getChatById(
            chatId,
            state.currentCompany?.id as string
          );
          if (chatData) {
            targetPostId = chatData.post?.id;
          }
        } catch (e) {
          logger.error("Erreur lors de la récupération du post", e);
          setError("Impossible de charger le post");
        }
      }

      if (!state.postPanel.isOpen && !shouldPanelBeOpen) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const postData = (await db.getPostById(
          targetPostId!,
          state.currentCompany?.id as string
        )) as SupabasePost | null;

        if (postData) {
          const converted = convertSupabasePost(postData);
          setPost(converted);
        } else {
          setError("Post non trouvé");
        }
      } catch (e) {
        logger.error("Erreur lors de la récupération du post", e);
        setError("Impossible de charger le post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [
    state.postPanel.postId,
    state.postPanel.isOpen,
    shouldPanelBeOpen,
    state.currentCompany?.id,
  ]);

  // === ACTIONS ===
  const handleClose = () => {
    dispatch({ type: "CLOSE_POST_PANEL" });

    // Navigation après l'animation pour éviter les saccades
    navigate(`/chats/${chatId}`, { replace: true });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSave = async (data: PostData) => {
    if (!post || !state.currentCompany?.id) {
      toast.error("Impossible de sauvegarder : données manquantes");
      return;
    }

    try {
      await db.updatePostById(
        post.id,
        {
          content: data.caption,
          hashtags: JSON.stringify(
            data.hashtags.split(" ").filter((tag) => tag.length > 0)
          ),
        },
        state.currentCompany.id
      );

      // Mise à jour optimiste de l'état local
      setPost((prevPost) => ({
        ...prevPost!,
        description: data.caption,
        hashtags: data.hashtags.split(" ").filter((tag) => tag.length > 0),
      }));

      toast.success("Post mis à jour avec succès");
    } catch (error) {
      logger.error("Erreur lors de la sauvegarde du post", error);
      toast.error("Erreur lors de la sauvegarde du post");
    }
  };

  const handleSchedule = async (date: Date) => {
    if (!post) {
      toast.error("Aucun post sélectionné");
      return;
    }

    if (!state.currentCompany?.id) {
      toast.error("Aucune entreprise sélectionnée");
      return;
    }

    // Validation : empêcher les dates du passé
    const now = new Date();
    if (date.getTime() <= now.getTime()) {
      toast.error("Impossible de programmer un post dans le passé");
      return;
    }

    try {
      // Appel API pour programmer le post
      await db.updatePostScheduledAtById(
        post.id,
        date,
        state.currentCompany.id
      );

      // Mise à jour optimiste de l'état local
      setPost((prevPost) => ({
        ...prevPost!,
        status: "scheduled",
        scheduledAt: date,
      }));

      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      toast.success(
        `Post programmé pour le ${formattedDate} à ${formattedTime}`
      );
    } catch (error) {
      logger.error("Erreur lors de la programmation du post", error);
      toast.error("Erreur lors de la programmation du post");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!post || !state.currentCompany?.id) {
      toast.error("Impossible de supprimer l'image : données manquantes");
      return;
    }

    try {
      await db.deleteMediaById(imageId);

      // Mise à jour optimiste de l'état local
      setPost((prevPost) => ({
        ...prevPost!,
        images: prevPost!.images?.filter((image) => image.id !== imageId),
      }));

      toast.success("Image supprimée avec succès");
    } catch (error) {
      logger.error("Erreur lors de la suppression de l'image", error);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  // === INTERFACE PUBLIQUE ===
  return {
    // États en lecture seule
    post,
    isLoading,
    error,
    activeTab,

    // Actions
    setActiveTab,
    handleClose,
    handleOverlayClick,
    handleSave,
    handleSchedule,
    handleDeleteImage,
  } as const;
};
