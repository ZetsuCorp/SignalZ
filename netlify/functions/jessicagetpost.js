
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// 🔐 Supabase client setup
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// 🧠 Handler
export const handler: Handler = async (event) => {
  const wall_type = event.queryStringParameters?.wall_type || "main";

  // 🎯 Only get Jessica posts from the specified wall
  const { data, error } = await supabase
    .from("posts")
    .select("*, sigicon_url, display_name, background")
    .eq("session_id", "jessica-bot")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false })
    .limit(2); // 🛑 Limit to 2 posts only

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
