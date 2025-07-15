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

  // 🔎 Get normal posts with sigicon_url included
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*, session_id, background, sigicon_url, display_name")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false });

  // 🔗 Get social link posts
  const { data: links, error: linkError } = await supabase
    .from("linked_posts")
    .select("*, sigicon_url")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false });

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
