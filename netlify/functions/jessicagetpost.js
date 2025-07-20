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

  // 🎯 Fetch latest Jessica posts for this wall
  const { data, error } = await supabase
    .from("posts")
    .select("*, sigicon_url, display_name, background")
    .eq("session_id", "jessica-bot")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false })
    .limit(2); // 🛑 Limit to 2

  if (error || !data) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message || "No data found" }),
    };
  }

  // 🚀 Push each post to main World Feed via create-posts endpoint
  const results = [];
  for (const post of data) {
    const res = await fetch(`${process.env.URL}/.netlify/functions/create-posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    results.push({
      headline: post.headline,
      status: res.status,
      ok: res.ok,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `✅ Forwarded ${results.length} Jessica posts to World Feed.`,
      results,
    }),
  };
};
