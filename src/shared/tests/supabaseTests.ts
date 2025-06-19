import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dirkemlfbqaybvddeeis.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmtlbWxmYnFheWJ2ZGRlZWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTA1ODUsImV4cCI6MjA2MjYyNjU4NX0.zB5YKufvD_G_ew5EIiKOTb7tbznKft2T6gp4Vlzt0cY";

// Supabase service
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase client initialized with URL:", supabaseUrl);

async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from("post")
      .select()
      .eq("company_id", 1);

    if (error) throw error;

    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
}

getAllPosts();
