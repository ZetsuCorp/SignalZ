import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
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

  try {
    // Fetch regular posts
    const { data: normalPosts, error: normalError } = await supabase
      .from("posts")
      .select("*")
      .eq("wall_type", wall_type)
      .order("created_at", { ascending: false });

    if (normalError) throw normalError;

    // Fetch social link posts
    const { data: linkedPosts, error: linkError } = await supabase
      .from("linked_posts")
      .select("*")
      .eq("wall_type", wall_type)
      .order("created_at", { ascending: false });

    if (linkError) throw linkError;

    // Add tag so frontend knows it's a link post
    const taggedLinks = (linkedPosts || []).map((post) => ({
      ...post,
      isLinkPost: true,
    }));

    // Merge and sort all posts by date
    const combined = [...(normalPosts || []), ...taggedLinks].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      statusCode: 200,
      body: JSON.stringify(combined),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};

export { handler };
