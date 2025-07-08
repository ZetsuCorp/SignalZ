// netlify/functions/create-link-post.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// ✅ Use public anon key to match other functions
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      link_title,
      caption,
      cta_link_url,
      tags = [],
      session_id,
      wall_type = "main",
      link_image,
      video_url,
    } = body;

    if (!link_title || !cta_link_url || !session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const { error } = await supabase.from("linked_posts").insert([
      {
        link_title,
        caption,
        cta_link_url,
        tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()),
        session_id,
        wall_type,
        link_image,
        video_url,
      },
    ]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Link post created successfully" }),
    };
  } catch (err) {
    console.error("Error creating link post:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating link post", error: err.message }),
    };
  }
};
