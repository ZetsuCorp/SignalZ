import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  const wall_type = event.queryStringParameters?.wall_type;

  if (!wall_type) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing wall_type" }),
    };
  }

  // 🔎 Get normal posts — Main/Zetsu returns ALL, others filter by wall_type
  let postsQuery = supabase
    .from("posts")
    .select("*, session_id, background, sigicon_url, display_name")
    .order("created_at", { ascending: false });

  if (wall_type !== "main") {
    postsQuery = postsQuery.eq("wall_type", wall_type);
  }

  const { data: posts, error: postError } = await postsQuery;

  // 🔗 Get social link posts — same logic
  let linksQuery = supabase
    .from("linked_posts")
    .select("*, sigicon_url")
    .order("created_at", { ascending: false });

  if (wall_type !== "main") {
    linksQuery = linksQuery.eq("wall_type", wall_type);
  }

  const { data: links, error: linkError } = await linksQuery;

  if (postError || linkError) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: postError?.message || linkError?.message,
      }),
    };
  }

  // 🏷️ Tag linked posts
  const linksTagged = (links || []).map((p) => ({ ...p, isLinkPost: true }));

  // 📦 Merge and return
  const allPosts = [...(posts || []), ...linksTagged];

  return {
    statusCode: 200,
    body: JSON.stringify(allPosts),
  };
};

export { handler };
