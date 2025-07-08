// netlify/functions/create-link-post.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      url,
      session_id,
      wall_type = "main",
      tags = ["link"],
      link_title = "Shared via SignalZ",
      link_image = null,
      video_url = null,
      image_url = null,
      cta_link_url,
    } = body;

    if (!url || !session_id || !wall_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const { error } = await supabase.from("posts").insert([
      {
        headline: link_title,
        caption: url,
        cta_link_url,
        tags,
        session_id,
        wall_type,
        image_url: link_image || image_url,
        video_url,
      },
    ]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Link post created in posts table" }),
    };
  } catch (err) {
    console.error("Error creating link post:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating link post", error: err.message }),
    };
  }
};
