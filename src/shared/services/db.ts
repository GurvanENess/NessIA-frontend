import { supabaseClient } from "./supabase";

export const db = {
  async getChatSessionMessages(sessionId: string, companyId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("message")
        .select("*")
        .eq("session_id", sessionId)
        .eq("user_id", companyId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  },

  async getAllPosts() {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .select(
          `
                id, title, content_text, created_at, status,
                platform ( name ),
                session!post_session_id_fkey ( id ),
                media ( url )
            `
        )
        .eq("company_id", 1)
        .order("created_at", { ascending: false })
        .order("url", { ascending: false, referencedTable: "media" });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async getPostById(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .select(
          `title, content_text, hashtags, created_at, id, status,
            platform( name ),
            session!post_session_id_fkey ( id ),
            media ( url )
            `
        )
        .eq("id", id)
        .order("url", { ascending: false, referencedTable: "media" })
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async deletePostById(id: string) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .delete()
        .eq("id", id)
        .eq("company_id", 1);

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  },

  async updatePostById(
    id: string,
    { content, hashtags }: { content: string; hashtags: string }
  ) {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .update({ content_text: content, hashtags: hashtags })
        .eq("id", id)
        .eq("company_id", 1)
        .select();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error updating post", id, ":", err);
      throw err;
    }
  },

  async getAllChats() {
    try {
      const { data, error } = await supabaseClient
        .from("session")
        .select(
          `
          *,
          message!message_session_id_fkey(count),
          post (
            id
          )
          `
        )
        .eq("company_id", 1)
        .not("summary", "is", null)
        .limit(20)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err; // Re-throw the error for further handling
    }
  },

  async getChatById(sessionId: string) {
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
        .single();

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
      console.error("Error:", err);
      throw err;
    }
  },

  async deleteChatById(id: string) {
    /*
    Attention. Par effet cascade en supprimant une session
    on supprime a minima le post et tous les messages associés
    */
    console.log("HERE", id);
    try {
      const response = await supabaseClient
        .from("session")
        .delete()
        .eq("id", id)
        .eq("company_id", 1);

      return response;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  },

  async getRunningJobs(sessionId: string): Promise<unknown[]> {
    try {
      const { data, error } = await supabaseClient
        .from("job_state")
        .select("*")
        .eq("session_id", sessionId)
        .in("status", ["running", "waiting_user", "error"])
        .is("finished_at", null);

      const firstJob = data?.[0];

      if (error) throw error;
      if (firstJob?.status === "error") {
        throw new Error(firstJob.error_msg);
      }
      return data || [];
    } catch (err) {
      console.error(
        `Error while retrieving the jobs of session ${sessionId}`,
        err
      );
      throw err;
    }
  },
};
