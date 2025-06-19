import { supabaseClient } from "./supabase";

export const db = {
  async getAllPosts() {
    try {
      const { data, error } = await supabaseClient
        .from("post")
        .select(
          `title, content_text, created_at, id, status,
            platform(
                name
            )
            `
        )
        .eq("company_id", 1);

      if (error) throw error;

      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err; // Re-throw the error for further handling
    }
  },
};
