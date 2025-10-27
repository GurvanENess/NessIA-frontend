import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../shared/contexts/AppContext";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { Media } from "../../../shared/entities/MediaTypes";
import { PostData } from "../../../shared/entities/PostTypes";
import { db } from "../../../shared/services/db";
import { logger } from "../../../shared/utils/logger";
import {
  convertSupabasePost,
  SupabasePost,
} from "../../../shared/utils/postUtils";
import { Post } from "../../Posts/entities/PostTypes";
import { MediaWithUploadState } from "../entities/media";
import { PublicationService } from "../services/publicationService";

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
  const { user } = useAuth();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // === ÉTATS LOCAUX ===
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<MediaWithUploadState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTabState] = useState<
    "preview" | "edit" | "schedule"
  >("preview");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // === COMPUTED VALUES ===
  const postId = state.postPanel.postId || "";
  const isPostRoute = location.pathname.includes("/post");
  const shouldPanelBeOpen = isPostRoute;

  const getTabFromHash = (): "preview" | "edit" | "schedule" => {
    const hash = location.hash.replace("#", "");
    if (hash === "edit" || hash === "preview" || hash === "schedule") {
      return hash;
    }
    return "preview";
  };

  // Fonction publique pour changer d'onglet (met à jour l'état ET l'URL)
  const setActiveTab = (tab: "preview" | "edit" | "schedule") => {
    // Empêcher la navigation vers "edit" ou "schedule" si le post est publié
    if (
      post?.status === "published" &&
      (tab === "edit" || tab === "schedule")
    ) {
      toast.error("Ce post est déjà publié et ne peut plus être modifié");
      return;
    }

    setActiveTabState(tab);

    const currentPath = location.pathname + location.search;
    navigate(`${currentPath}#${tab}`, { replace: true });
  };

  // === FONCTIONS UTILITAIRES ===
  const convertToMediaWithUploadState = (
    postImages: Media[] = []
  ): MediaWithUploadState[] =>
    postImages.map((image, index) => ({
      ...image,
      uploadState: "uploaded" as const,
      position: image.position ?? index, // Utiliser la position existante ou l'index
    }));

  // === SYNCHRONISATION URL ↔ ÉTAT ===
  useEffect(() => {
    if (shouldPanelBeOpen && !state.postPanel.isOpen) {
      dispatch({ type: "OPEN_POST_PANEL", payload: postId });
    } else if (!shouldPanelBeOpen && state.postPanel.isOpen) {
      dispatch({ type: "CLOSE_POST_PANEL" });
    }
  }, [shouldPanelBeOpen, state.postPanel.isOpen, dispatch, postId]);

  // === SYNCHRONISATION HASH ↔ ÉTAT (séparé) ===
  useEffect(() => {
    const hash = getTabFromHash();

    // Mettre à jour SEULEMENT l'état local, pas l'URL
    if (hash !== activeTab) {
      setActiveTabState(hash);
      const currentPath = location.pathname + location.search;
      navigate(`${currentPath}#${hash}`, { replace: true });
    }
  }, [location.hash]); // Ne pas inclure activeTab dans les dépendances

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
          // Initialiser l'état des images
          setImages(convertToMediaWithUploadState(converted.images));
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
          imagePositions: data.imagePositions, // Passer les positions
        },
        state.currentCompany.id
      );

      // Mise à jour optimiste de l'état local
      setPost((prevPost) => ({
        ...prevPost!,
        description: data.caption,
        hashtags: data.hashtags.split(" ").filter((tag) => tag.length > 0),
        images: data.images, // Mettre à jour avec les nouvelles positions
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

      // Mettre à jour aussi l'état des images dans l'éditeur
      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );

      toast.success("Image supprimée avec succès");
    } catch (error) {
      logger.error("Erreur lors de la suppression de l'image", error);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  // Handler pour les changements d'images
  const handleImagesChange = (newImages: MediaWithUploadState[]) => {
    setImages(newImages);

    // Synchroniser avec l'état du post en conservant les positions
    const uploadedImages = newImages
      .filter((image) => image.uploadState === "uploaded")
      .map((image) => ({
        id: image.id,
        url: image.url,
        position: image.position ?? 0, // Conserver la position
      }));

    setPost((prevPost) =>
      prevPost ? { ...prevPost, images: uploadedImages } : null
    );
  };

  // Handler pour la suppression de post
  const handleDeletePost = async () => {
    if (!post || !state.currentCompany?.id) {
      toast.error("Impossible de supprimer le post : données manquantes");
      return;
    }

    try {
      await db.deletePostById(post.id, state.currentCompany.id);

      // Fermer le panel et naviguer vers le chat
      dispatch({ type: "CLOSE_POST_PANEL" });
      navigate(`/chats/${chatId}`, { replace: true });

      toast.success("Post supprimé avec succès");
    } catch (error) {
      logger.error("Erreur lors de la suppression du post", error);
      toast.error("Erreur lors de la suppression du post");
    }
  };

  // Handler pour ouvrir la modale de suppression
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Handler pour fermer la modale de suppression
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Handler pour ouvrir la modale de publication
  const handleOpenPublishModal = () => {
    setIsPublishModalOpen(true);
  };

  // Handler pour fermer la modale de publication
  const handleClosePublishModal = () => {
    setIsPublishModalOpen(false);
  };

  // Handler pour la publication de post
  const handlePublish = () => {
    handleOpenPublishModal();
  };

  // Handler pour confirmer la publication
  const handlePublishConfirm = async () => {
    if (
      !post ||
      !state.currentCompany?.id ||
      !user?.token ||
      !state.chat.sessionId
    ) {
      toast.error("Impossible de publier le post : données manquantes");
      return;
    }

    try {
      // Utiliser le service de publication
      await PublicationService.publishPost(
        post.id,
        state.currentCompany.id,
        user.token,
        state.chat.sessionId
      );

      // Mise à jour optimiste de l'état local
      setPost((prevPost) => ({
        ...prevPost!,
        status: "published",
        publishedAt: new Date(),
      }));

      toast.success("Post publié avec succès");
    } catch (error) {
      logger.error("Erreur lors de la publication du post", error);
      toast.error("Erreur lors de la publication du post");
    }
  };

  // === INTERFACE PUBLIQUE ===
  return {
    // États en lecture seule
    post,
    images,
    isLoading,
    error,
    activeTab,
    isDeleteModalOpen,
    isPublishModalOpen,

    // Actions
    setActiveTab,
    handleClose,
    handleOverlayClick,
    handleSave,
    handleSchedule,
    handleDeleteImage,
    handleImagesChange,
    handleDeletePost,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handlePublish,
    handleOpenPublishModal,
    handleClosePublishModal,
    handlePublishConfirm,
  } as const;
};
