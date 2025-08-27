import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit, Eye, MessageSquare, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../pages/Posts/entities/PostTypes";
import { useApp } from "../contexts/AppContext";
import { db } from "../services/db";
import { logger } from "../utils/logger";

// Type pour les données Supabase
interface SupabasePost {
  id: string;
  title: string;
  content_text: string;
  hashtags: string[] | null;
  created_at: string;
  status: string;
  platform: { name: string } | null;
  session: { id: string } | null;
  media: { url: string }[] | null;
}

const PostViewPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { postPanel } = state;
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

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
    return {
      id: supabasePost.id,
      title: supabasePost.title,
      description: supabasePost.content_text,
      status: supabasePost.status as Post["status"],
      platform:
        (supabasePost.platform?.name as Post["platform"]) || "instagram",
      createdAt: new Date(supabasePost.created_at),
      imageUrl: supabasePost.media?.[0]?.url,
      hashtags: Array.isArray(supabasePost.hashtags)
        ? supabasePost.hashtags
        : [],
      userId: "", // Non disponible dans la requête actuelle
      conversationId: supabasePost.session?.id,
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
          setPost(convertSupabasePost(postData));
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#7C3AED]" />
              <h2 className="text-xl font-semibold text-gray-900">
                Détails du post
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
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
              <div className="p-6">
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full max-h-96 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* Post Title */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  {/* Status and Platform badges */}
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
                </div>

                {/* Post Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.description}
                  </p>
                </div>

                {/* Hashtags */}
                {post.hashtags &&
                  Array.isArray(post.hashtags) &&
                  post.hashtags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Hashtags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((hashtag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                          >
                            #{hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Post Metadata */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Informations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Créé le{" "}
                        {format(post.createdAt, "d MMMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    {post.scheduledAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">
                          Programmé le{" "}
                          {format(post.scheduledAt, "d MMMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">
                          Publié le{" "}
                          {format(post.publishedAt, "d MMMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Associated Chat */}
                {post.conversationId && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Chat associé
                    </h4>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-800 font-medium">
                        Ce post a été généré depuis une conversation
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer Actions */}
          {post && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostViewPanel;
