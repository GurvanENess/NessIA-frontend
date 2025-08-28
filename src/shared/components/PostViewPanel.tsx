import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Hash,
  Image,
  MessageSquare,
  Pen,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Post } from "../../pages/Posts/entities/PostTypes";
import { useApp } from "../contexts/AppContext";
import { PostData } from "../entities/PostTypes";
import { db } from "../services/db";
import InstagramPost from "./InstagramPost";

// Type pour les données Supabase
interface SupabasePost {
  id: string;
  title: string;
  content_text: string;
  hashtags: string[] | null;
  created_at: string;
  status: string;
  platform: { name: string }[] | { name: string } | null;
  session: { id: string }[] | { id: string } | null;
  media: { url: string }[] | null;
}

const PostViewPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { postPanel } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams<{ chatId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "edit" | "schedule">(
    "preview"
  );
  const [editData, setEditData] = useState<PostData>({
    image: "",
    caption: "",
    hashtags: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Détecter si on est sur l'URL du post
  const isOnPostURL = location.pathname.endsWith("/post/");

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fonction pour convertir les données Supabase en format Post
  const convertSupabasePost = (supabasePost: SupabasePost): Post => {
    // Gestion du platform qui peut être un objet ou un tableau
    const platformName = Array.isArray(supabasePost.platform)
      ? supabasePost.platform[0]?.name
      : supabasePost.platform?.name;

    // Gestion de session qui peut être un objet ou un tableau
    const sessionId = Array.isArray(supabasePost.session)
      ? supabasePost.session[0]?.id
      : supabasePost.session?.id;

    return {
      id: supabasePost.id,
      title: supabasePost.title,
      description: supabasePost.content_text,
      status: supabasePost.status as Post["status"],
      platform: (platformName as Post["platform"]) || "instagram",
      createdAt: new Date(supabasePost.created_at),
      imageUrl: supabasePost.media?.[0]?.url,
      hashtags: Array.isArray(supabasePost.hashtags)
        ? supabasePost.hashtags
        : [],
      userId: "", // Non disponible dans la requête actuelle
      conversationId: sessionId,
    };
  };

  // Fetch post data when panel opens
  useEffect(() => {
    const fetchPost = async () => {
      if (!postPanel.isOpen || !postPanel.postId) return;

      setIsLoading(true);
      setError(null);
      try {
        const postData = await db.getPostById(
          postPanel.postId,
          state.currentCompany?.id as string
        );
        if (postData) {
          const convertedPost = convertSupabasePost(postData);
          setPost(convertedPost);
          // Initialiser les données d'édition
          setEditData({
            image: convertedPost.imageUrl || "",
            caption: convertedPost.description,
            hashtags: Array.isArray(convertedPost.hashtags)
              ? convertedPost.hashtags.join(" ")
              : "",
          });
        } else {
          setError("Post non trouvé");
        }
      } catch (err) {
        logger.error("Error fetching post", err);
        setError("Impossible de charger le post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postPanel.isOpen, postPanel.postId, state.currentCompany?.id]);

  // Gérer l'initialisation et la synchronisation URL
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);

      // Cas 1: Accès direct à l'URL post → ouvrir le panel
      if (isOnPostURL && !postPanel.isOpen && chatId) {
        const openPostFromChat = async () => {
          if (!state.currentCompany?.id) return;

          try {
            const chatData = await db.getChatById(
              chatId,
              state.currentCompany.id
            );
            if (chatData?.post?.id) {
              dispatch({ type: "OPEN_POST_PANEL", payload: chatData.post.id });
            } else {
              navigate(`/chats/${chatId}`, { replace: true });
            }
          } catch (error) {
            console.error("Error loading chat data:", error);
            navigate(`/chats/${chatId}`, { replace: true });
          }
        };
        openPostFromChat();
      }
      return;
    }

    // Cas 2: Panel ouvert mais pas sur l'URL post → naviguer vers l'URL
    if (postPanel.isOpen && chatId && !isOnPostURL) {
      navigate(`/chats/${chatId}/post/`, { replace: true });
    }

    // Cas 3: Panel fermé mais sur l'URL post → revenir au chat
    if (!postPanel.isOpen && isOnPostURL) {
      navigate(`/chats/${chatId}`, { replace: true });
    }
  }, [
    hasInitialized,
    postPanel.isOpen,
    chatId,
    isOnPostURL,
    navigate,
    state.currentCompany?.id,
    dispatch,
  ]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && postPanel.isOpen) {
        handleClose();
      }
    };

    if (postPanel.isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [postPanel.isOpen]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationComplete = (definition: string) => {
    if (definition === "exit" && isClosing) {
      dispatch({ type: "CLOSE_POST_PANEL" });
      setIsClosing(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "Publié";
      case "scheduled":
        return "Programmé";
      case "draft":
        return "Brouillon";
      default:
        return status;
    }
  };

  const getPlatformColor = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "facebook":
        return "bg-blue-100 text-blue-800";
      case "tiktok":
        return "bg-black text-white";
      case "twitter":
        return "bg-sky-100 text-sky-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformText = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "tiktok":
        return "TikTok";
      case "twitter":
        return "Twitter";
      default:
        return platform;
    }
  };

  // Fonctions pour l'édition
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditData((prev) => ({ ...prev, caption: event.target.value }));
  };

  const handleHashtagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev) => ({ ...prev, hashtags: event.target.value }));
  };

  const handleSave = async () => {
    if (!post || !state.currentCompany?.id) return;

    setIsSaving(true);
    try {
      await db.updatePostById(
        post.id,
        {
          content: editData.caption,
          hashtags: JSON.stringify(
            editData.hashtags.split(" ").filter((tag) => tag.length > 0)
          ),
        },
        state.currentCompany.id
      );

      // Mettre à jour le post local
      setPost((prev) =>
        prev
          ? {
              ...prev,
              description: editData.caption,
              hashtags: editData.hashtags
                .split(" ")
                .filter((tag) => tag.length > 0),
            }
          : null
      );

      toast.success("Post mis à jour avec succès");
      setActiveTab("preview");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Erreur lors de la mise à jour du post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (post) {
      setEditData({
        image: post.imageUrl || "",
        caption: post.description,
        hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(" ") : "",
      });
    }
    setActiveTab("preview");
  };

  // Fonction de programmation
  const handleSchedule = async () => {
    if (!post || !state.currentCompany?.id || !scheduledDate) return;

    setIsScheduling(true);
    try {
      // Pour le moment, on simule la programmation en front
      // Plus tard, on appellera une API backend pour programmer la publication

      // Mise à jour locale du post avec la date programmée
      setPost((prev) =>
        prev
          ? {
              ...prev,
              status: "scheduled" as Post["status"],
              scheduledAt: scheduledDate,
            }
          : null
      );

      toast.success(
        `Post programmé pour le ${scheduledDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })} à ${scheduledDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );

      setActiveTab("preview");
    } catch (err) {
      console.error("Error scheduling post:", err);
      toast.error("Erreur lors de la programmation du post");
    } finally {
      setIsScheduling(false);
    }
  };

  // Composant DateTimePicker intégré
  const DateTimePicker: React.FC<{
    selectedDate: Date | null;
    onDateTimeChange: (date: Date) => void;
    className?: string;
  }> = ({ selectedDate, onDateTimeChange, className = "" }) => {
    const now = new Date();
    const minDateTime = new Date(now.getTime() + 5 * 60 * 1000);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatDateTimeLocal = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDisplayDate = (date: Date): string => {
      return (
        date.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
        " à " +
        date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    const handleDateTimeChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      if (value) {
        const newDate = new Date(value);
        onDateTimeChange(newDate);
      }
    };

    const handleDivClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.showPicker?.();
      }
    };

    const getSuggestedDate = (suggestion: any) => {
      const date = new Date();
      if (suggestion.hours) {
        date.setHours(date.getHours() + suggestion.hours);
      } else if (suggestion.days) {
        date.setDate(date.getDate() + suggestion.days);
        const [hours, minutes] = suggestion.time!.split(":").map(Number);
        date.setHours(hours, minutes, 0, 0);
      } else if (suggestion.time) {
        const [hours, minutes] = suggestion.time.split(":").map(Number);
        date.setHours(hours, minutes, 0, 0);
        if (date <= now) {
          date.setDate(date.getDate() + 1);
        }
      }
      return date;
    };

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Date et heure de publication
          </h3>
        </div>

        <div className="relative cursor-pointer" onClick={handleDivClick}>
          <div className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white hover:border-purple-300 focus-within:border-purple-700 focus-within:ring-1 focus-within:ring-purple-700 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
            <div className="flex-1">
              <span
                className={`block ${
                  selectedDate ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {selectedDate
                  ? formatDisplayDate(selectedDate)
                  : "Sélectionner une date et heure"}
              </span>
              {selectedDate && (
                <span className="text-sm text-gray-500 mt-1 block">
                  Cliquez pour modifier
                </span>
              )}
            </div>
            <div className="ml-3 p-2 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <input
            ref={inputRef}
            type="datetime-local"
            value={selectedDate ? formatDateTimeLocal(selectedDate) : ""}
            onChange={handleDateTimeChange}
            min={formatDateTimeLocal(minDateTime)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {selectedDate && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 mb-1">
              <strong>Publication programmée pour :</strong>
            </p>
            <p className="text-purple-900 font-medium">
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              à{" "}
              {selectedDate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Suggestions rapides :
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Dans 1h", hours: 1 },
              { label: "Ce soir (20h)", hours: null, time: "20:00" },
              { label: "Demain 9h", days: 1, time: "09:00" },
              { label: "Demain 18h", days: 1, time: "18:00" },
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onDateTimeChange(getSuggestedDate(suggestion))}
                className="px-3 py-2 text-sm bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const panelVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3,
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3,
        opacity: { duration: 0.2 },
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!postPanel.isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        initial="hidden"
        animate={isClosing ? "exit" : "visible"}
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleOverlayClick}
        onAnimationComplete={handleAnimationComplete}
      >
        {/* Panel positionné pour correspondre exactement à la zone main */}
        <motion.div
          key="panel"
          ref={panelRef}
          initial="hidden"
          animate={isClosing ? "exit" : "visible"}
          exit="exit"
          variants={panelVariants}
          className="absolute bg-white shadow-2xl flex flex-col"
          style={{
            // Desktop: correspond exactement à la zone main (290px sidebar + main area)
            left: isMobile ? "0px" : "290px",
            top: isMobile ? "64px" : "0px", // 64px = h-16 mobile header
            right: "0px",
            bottom: "0px",
            width: isMobile ? "100vw" : "calc(100vw - 290px)",
            height: isMobile ? "calc(100vh - 64px)" : "100vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#7C3AED]" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === "edit"
                    ? "Modifier le post"
                    : activeTab === "schedule"
                    ? "Programmer le post"
                    : "Détails du post"}
                </h2>
              </div>
              {/* Actions du header */}
              <div className="flex items-center gap-2">
                {post?.conversationId && (
                  <button
                    onClick={() => {
                      navigate(`/chats/${post.conversationId}`);
                      handleClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors shadow-sm"
                    title="Voir le chat associé"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Voir le chat</span>
                  </button>
                )}
              </div>
            </div>

            {/* Onglets */}
            <div className="flex border-b">
              <motion.button
                onClick={() => setActiveTab("preview")}
                className={`pb-2 px-6 text-base cursor-pointer relative ${
                  activeTab === "preview"
                    ? "text-purple-700 font-semibold"
                    : "text-gray-600"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Aperçu
                {activeTab === "preview" && (
                  <motion.div
                    layoutId="activeTabPanel"
                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("edit")}
                className={`pb-2 px-6 text-base cursor-pointer relative ${
                  activeTab === "edit"
                    ? "text-purple-700 font-semibold"
                    : "text-gray-600"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Éditer
                {activeTab === "edit" && (
                  <motion.div
                    layoutId="activeTabPanel"
                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("schedule")}
                className={`pb-2 px-6 text-base cursor-pointer relative ${
                  activeTab === "schedule"
                    ? "text-purple-700 font-semibold"
                    : "text-gray-600"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Programmer
                {activeTab === "schedule" && (
                  <motion.div
                    layoutId="activeTabPanel"
                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-purple-700"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#E7E9F2]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            ) : post ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-6 bg-[#E7E9F2] min-h-full max-w-[1000px] mx-auto"
                >
                  {activeTab === "edit" ? (
                    // Mode Édition
                    <>
                      {/* Formulaire d'édition */}
                      <div className="space-y-6">
                        {/* Image */}
                        <div className="rounded-lg">
                          <div className="flex items-center mb-4">
                            <Image className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                              Image
                            </h3>
                          </div>
                          <div className="border-2 bg-white border-gray-200 rounded-lg min-h-[200px] flex justify-center items-center relative overflow-hidden focus-within:border-purple-700 focus-within:ring-1 focus-within:ring-purple-700 transition-colors">
                            <div className="max-w-[400px] w-full h-full flex items-center justify-center">
                              <img
                                src={editData.image || "/assets/default.jpg"}
                                alt={
                                  editData.image
                                    ? "Uploaded content"
                                    : "Placeholder"
                                }
                                className="max-w-full max-h-[400px] w-auto h-auto object-contain"
                              />
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              onClick={handleImageClick}
                              className="absolute top-3 right-3 w-8 h-8 p-[7px] flex justify-center items-center cursor-pointer rounded-full shadow-lg bg-white hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2"
                            >
                              <Pen className="w-full h-full text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Légende */}
                        <div className="rounded-lg">
                          <div className="flex items-center mb-4">
                            <Pencil className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                              Légende
                            </h3>
                          </div>
                          <textarea
                            className="w-full p-3 border-2 border-gray-200 rounded-md text-base box-border resize-y min-h-[100px] bg-white focus-visible:border-purple-700 focus-visible:ring-1 focus-visible:ring-purple-700 focus-visible:outline-none transition-colors"
                            placeholder="Décrivez votre post..."
                            rows={4}
                            value={editData.caption}
                            onChange={handleCaptionChange}
                          />
                        </div>

                        {/* Hashtags */}
                        <div className="rounded-lg">
                          <div className="flex items-center mb-4">
                            <Hash className="w-5 h-5 text-gray-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">
                              Hashtags
                            </h3>
                          </div>
                          <input
                            type="text"
                            className="w-full p-3 border-2 border-gray-200 rounded-md text-base box-border bg-white focus-visible:border-purple-700 focus-visible:ring-1 focus-visible:ring-purple-700 focus-visible:outline-none transition-colors"
                            placeholder="#exemple #hashtags"
                            value={editData.hashtags}
                            onChange={handleHashtagsChange}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Séparez les hashtags par des espaces
                          </p>
                        </div>

                        {/* Informations du post */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Informations
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                  post.status
                                )}`}
                              >
                                {getStatusText(post.status)}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(
                                  post.platform
                                )}`}
                              >
                                {getPlatformText(post.platform)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                Créé le{" "}
                                {format(
                                  post.createdAt,
                                  "d MMMM yyyy 'à' HH:mm",
                                  { locale: fr }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : activeTab === "schedule" ? (
                    // Mode Programmation
                    <div className="space-y-6">
                      <DateTimePicker
                        selectedDate={scheduledDate}
                        onDateTimeChange={setScheduledDate}
                      />

                      {/* Informations actuelles du post */}
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Aperçu du post à programmer
                        </h4>
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {getStatusText(post.status)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(
                              post.platform
                            )}`}
                          >
                            {getPlatformText(post.platform)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {editData.caption || post.description}
                        </p>
                        {(editData.hashtags ||
                          (post.hashtags && post.hashtags.length > 0)) && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(editData.hashtags
                              ? editData.hashtags.split(" ")
                              : post.hashtags || []
                            )
                              .filter((tag) => tag.length > 0)
                              .slice(0, 5)
                              .map((hashtag, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  #{hashtag}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Mode Aperçu
                    <div className="flex justify-center">
                      <InstagramPost
                        image={editData.image || post.imageUrl || ""}
                        caption={editData.caption}
                        hashtags={editData.hashtags}
                        className="max-w-[400px]"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>

          {/* Footer Actions */}
          {post && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeTab === "preview" && (
                    <>
                      <button
                        onClick={() => setActiveTab("edit")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("schedule")}
                        className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Programmer</span>
                      </button>
                    </>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>

                {activeTab === "edit" && (
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </motion.button>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setActiveTab("preview")}
                      className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={handleSchedule}
                      disabled={isScheduling || !scheduledDate}
                      className="px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isScheduling ? "Programmation..." : "Programmer"}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostViewPanel;
