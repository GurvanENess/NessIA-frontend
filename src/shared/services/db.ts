import { SupabaseProfile } from "../../pages/Settings/entities/ProfileTypes";
import { logger } from "../utils/logger";
import { supabaseClient } from "./supabase";

export const db = {
  async getLastMediaOfChat(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from("media")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching images of session", err);
      throw err;
    }
  },

  async deleteMediaById(id: string) {
    console.log("deleteMediaById", id);
    try {
      const { data, error } = await supabaseClient
        .from("media")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error deleting media by id", err);
      throw err;
    }
  },

  async getAllMediasOfChat(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from("media")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching images of session", err);
      throw err;
    }
  },

  async getMediasBySessionId(sessionId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("media")
        .select("id, url, position, selected, session_id, created_at")
        .eq("session_id", sessionId)
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching medias by session id", err);
      throw err;
    }
  },

  async updateMediaSelection(mediaId: string, selected: boolean, position?: number) {
    try {
      const updateData: { selected: boolean; position?: number } = { selected };
      if (position !== undefined) {
        updateData.position = position;
      }

      const { data, error } = await supabaseClient
        .from("media")
        .update(updateData)
        .eq("id", mediaId)
        .select();

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error updating media selection", err);
      throw err;
    }
  },

  async getCompaniesByUserId(userId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("v_company_with_platforms")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching companies", err);
      throw err;
    }
  },

  async getChatSessionMessages(sessionId: string, companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("message")
        .select("*, media( id, url )")
        .eq("session_id", sessionId)
        .eq("user_id", companyId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("data", data);

      return data;
    } catch (err) {
      logger.error("Error fetching chat session messages", err);
      throw err;
    }
  },

  async getAllPosts(companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .select(
          `
                id, title, content_text, created_at, status, scheduled_at,
                platform ( name ),
                session!post_session_id_fkey ( 
                id,
                media( id, url, position, selected )
                )
            `
        )
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filtrer et trier les médias sélectionnés pour chaque post
      if (data && Array.isArray(data)) {
        data.forEach((post: any) => {
          if (post.session) {
            const session = post.session as any;
            if (session.media && Array.isArray(session.media)) {
              session.media = session.media
                .filter((media: any) => media.selected === true)
                .sort((a: any, b: any) => 
                  (a.position ?? 0) - (b.position ?? 0)
                );
            }
          }
        });
      }

      return data;
    } catch (err) {
      logger.error("Error fetching all posts", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async getPostById(sessionId: string, companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .select(
          `title, content_text, hashtags, created_at, id, status, scheduled_at,
            platform( name ),
            session!post_session_id_fkey ( 
              id,
              media!inner( id, url, created_at, position, selected, session_id )
            )
            `
        )
        .eq("id", sessionId)
        .eq("company_id", companyId)
        .maybeSingle();

      if (error) throw error;

      // Filtrer et trier les médias sélectionnés côté client
      if (data && data.session) {
        const session = data.session as any;
        if (session.media && Array.isArray(session.media)) {
          session.media = session.media
            .filter((media: any) => media.selected === true)
            .sort((a: any, b: any) => 
              (a.position ?? 0) - (b.position ?? 0)
            );
        }
      }

      return data;
    } catch (err) {
      logger.error("Error fetching post by id", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async deletePostById(id: string, companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .delete()
        .eq("id", id)
        .eq("company_id", companyId);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error deleting post by id", err);
      throw err;
    }
  },

  async updatePostById(
    id: string,
    {
      content,
      hashtags,
      imagePositions,
    }: {
      content: string;
      hashtags: string;
      imagePositions?: { id: string; position: number }[];
    },
    companyId: string
  ) {
    try {
      // Mettre à jour le post
      const { data, error } = await supabaseClient
        .from("post")
        .update({ content_text: content, hashtags: hashtags })
        .eq("id", id)
        .eq("company_id", companyId)
        .select();

      if (error) throw error;

      // Si des positions d'images sont fournies, les mettre à jour
      if (imagePositions && imagePositions.length > 0) {
        for (const imagePosition of imagePositions) {
          const { error: mediaError } = await supabaseClient
            .from("media")
            .update({ position: imagePosition.position })
            .eq("id", imagePosition.id);

          if (mediaError) {
            logger.error(
              `Error updating media position for ${imagePosition.id}`,
              mediaError
            );
          }
        }
      }

      return data;
    } catch (err) {
      logger.error(`Error updating post ${id}`, err);
      throw err;
    }
  },

  async updatePostScheduledAtById(
    id: string,
    scheduledAt: Date,
    companyId: string
  ) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .update({ scheduled_at: scheduledAt })
        .eq("id", id)
        .eq("company_id", companyId);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error(`Error updating post scheduled at ${id}`, err);
      throw err;
    }
  },

  async getAllChats(companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("session")
        .select(
          `
          *,
          message!message_session_id_fkey(count),
          last_message:message!session_last_msg_id_fkey(created_at),
          post (
            id
          )
          `
        )
        .eq("company_id", companyId)
        .limit(20)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching all chats", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async getChatById(sessionId: string, companyId: string) {
    try {
      // Récupère la session et tous ses messages associés, triés par date
      const { data, error } = await supabaseClient
        .from("session")
        .select(
          `
          *,
          message!message_session_id_fkey (
            id,
            user_id,
            created_at,
            role,
            content
          ),
          post (
            id
          )
        `
        )
        .eq("id", sessionId)
        .eq("company_id", companyId)
        .maybeSingle();

      if (error) throw error;

      // Trie les messages par date (au cas où Supabase ne le fait pas)
      if (data && data.message) {
        data.message.sort(
          (a: { created_at: string }, b: { created_at: string }) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      return data;
    } catch (err) {
      logger.error("Error fetching chat by id", err);
      throw err;
    }
  },

  async deleteChatById(id: string, companyId: string) {
    /*
    Attention. Par effet cascade en supprimant une session
    on supprime a minima le post et tous les messages associés
    */
    try {
      const response = await supabaseClient
        .from("session")
        .delete()
        .eq("id", id)
        .eq("company_id", companyId);

      return response;
    } catch (err) {
      logger.error("Error deleting chat by id", err);
      throw err;
    }
  },

  async renameChatById(id: string, newName: string, companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("session")
        .update({ title: newName })
        .eq("id", id)
        .eq("company_id", companyId)
        .select();

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error(`Error renaming chat ${id}`, err);
      throw err;
    }
  },

  async getRunningJobs(sessionId: string): Promise<unknown[]> {
    try {
      const { data, error } = await supabaseClient
        .from("job_state")
        .select("*")
        .eq("session_id", sessionId)
        .in("status", ["running", "waiting_user"])
        .is("finished_at", null);

      if (error) throw error;

      return data || [];
    } catch (err) {
      logger.error(
        `Error while retrieving the jobs of session ${sessionId}`,
        err
      );
      throw err;
    }
  },

  async getConnectedPlatforms(companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("v_company_platforms")
        .select("platform_name, account_name")
        .eq("company_id", companyId);

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching connected platforms", err);
      throw err;
    }
  },

  async getCompanyData(companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("company")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error fetching company data", err);
    }
  },

  async updateCompanyData(id: string, companyData: SupabaseProfile) {
    try {
      const { data, error } = await supabaseClient
        .from("company")
        .update({ ...companyData })
        .eq("id", id)
        .select("*");

      if (error) throw error;

      return data;
    } catch (err) {
      logger.error("Error updating company data", err);
    }
  },
};
