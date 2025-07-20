const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const handler = async (event) => {
  const wall_type = event.queryStringParameters?.wall_type || "main";

  const { data, error } = await supabase
    .from("posts")
    .select("*, sigicon_url, display_name, background")
    .eq("session_id", "jessica-bot")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error || !data) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message || "No data found" }),
    };
  }

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

module.exports = { handler };
