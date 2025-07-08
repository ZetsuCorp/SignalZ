// netlify/functions/get-link-posts.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler: Handler = async (event) => {
  const wallType = event.queryStringParameters?.wall_type || "main";

  try {
    const { data, error } = await supabase
      .from("linked_posts")
      .select("id, link_title as headline, caption, cta_link_url as cta_url, tags, session_id, created_at, link_image as image_url, video_url, wall_type")
      .eq("wall_type", wallType)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Error in get-link-posts:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch linked posts", error: err.message }),
    };
  }
};
