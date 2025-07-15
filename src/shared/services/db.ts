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

  async addMessageToChatSession(message: unknown) {
    try {
      const { data, error } = await supabaseClient
        .from("message")
        .insert(message);

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
                session ( id ),
                media ( url )
            `
        )
        .eq("company_id", 1)
        .order("created_at", { ascending: false })
        .order("url", { ascending: false, referencedTable: "media" });

      if (error) throw error;

      console.log(data);
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
          `title, content_text, created_at, id, status,
            platform( name ),
            session( id ),
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
};
