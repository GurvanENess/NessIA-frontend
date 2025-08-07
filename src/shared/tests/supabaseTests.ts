import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dirkemlfbqaybvddeeis.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmtlbWxmYnFheWJ2ZGRlZWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTA1ODUsImV4cCI6MjA2MjYyNjU4NX0.zB5YKufvD_G_ew5EIiKOTb7tbznKft2T6gp4Vlzt0cY";

// Supabase service
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function getAllPosts() {
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
      .limit(1, { referencedTable: "media" });

    if (error) throw error;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getChatSessionMessages(sessionId: string, companyId: string) {
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
}

getChatSessionMessages(
  "820f80b1-40fe-45eb-ab03-388bc5d8c553",
  "fc6073ea-907b-4943-8852-6ea225d9858d"
);
