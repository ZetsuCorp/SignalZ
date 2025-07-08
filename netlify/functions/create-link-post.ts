import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      url,
      session_id,
      wall_type,
      tags,
      link_title,
      link_image,
      image_url,
      video_url,
      cta_link_url,
    } = body;

    if (!url || !session_id || !wall_type) {
      console.error("Missing required fields:", { url, session_id, wall_type });
      return { statusCode: 400, body: "Missing required fields" };
    }

    const { data, error } = await supabase.from("linked_posts").insert([
      {
        url,
        session_id,
        wall_type,
        tags: tags || [],
        link_title: link_title || "Untitled",
        link_image: link_image || null,
        image_url: image_url || null,
        video_url: video_url || null,
        cta_link_url: cta_link_url || null,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data?.[0]?.id }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

export { handler };
