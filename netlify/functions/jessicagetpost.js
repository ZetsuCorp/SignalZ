const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const handler = async (event) => {
  const wall_type = event.queryStringParameters?.wall_type || "main";

  // Step 1: Fetch up to 2 Jessica posts from Supabase
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("session_id", "jessica-bot")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error || !data || data.length === 0) {
    console.warn("❌ No Jessica posts found or error:", error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "⛔ No Jessica posts found to forward.",
        results: [],
      }),
    };
  }

  // Step 2: Forward each post to your create-posts endpoint
  const results = [];
  for (const post of data) {
    try {
      const res = await fetch(`${process.env.URL}/.netlify/functions/create-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: post.headline,
          caption: post.caption,
          tags: post.tags || [],
          image_url: post.image_url || null,
          video_url: post.video_url || null,
          cta_url: post.cta_url || "",
          wall_type: post.wall_type,
          session_id: post.session_id,
          sigicon_url: post.sigicon_url || "",
          display_name: post.display_name || "Jessica AI",
          background: post.background || "",
        }),
      });

      results.push({
        headline: post.headline,
        status: res.status,
        ok: res.ok,
      });
    } catch (err) {
      console.error(`💥 Failed to forward post: ${post.headline}`, err);
      results.push({
        headline: post.headline,
        status: 500,
        ok: false,
        error: err.message,
      });
    }
  }

  // Step 3: Done
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `✅ Forwarded ${results.length} Jessica posts to World Feed.`,
      results,
    }),
  };
};

module.exports = { handler };
