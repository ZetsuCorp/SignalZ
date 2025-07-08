// netlify/functions/get-all-posts.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // ✅ Match other working functions
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  const wallType = event.queryStringParameters?.wall_type || "main";

  try {
    // ✅ Get normal posts
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, headline, caption, cta_url, tags, session_id, created_at, image_url, video_url, wall_type")
      .eq("wall_type", wallType)
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    // ✅ Get link posts (linked_posts table)
    const { data: linkedData, error: linkedError } = await supabase
      .from("linked_posts")
      .select("id, link_title as headline, caption, cta_link_url as cta_url, tags, session_id, created_at, link_image as image_url, video_url, wall_type")
      .eq("wall_type", wallType)
      .order("created_at", { ascending: false });

    if (linkedError) throw linkedError;

    // ✅ Combine & sort newest first
    const allPosts = [...postsData, ...linkedData].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      statusCode: 200,
      body: JSON.stringify(allPosts),
    };
  } catch (err) {
    console.error("Error fetching all posts:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch posts", error: err.message }),
    };
  }
};

