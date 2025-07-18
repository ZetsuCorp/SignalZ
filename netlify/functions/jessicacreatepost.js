import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const raw = JSON.parse(event.body || "{}");

    // 🧽 Coerce and sanitize fields to avoid Supabase issues
    const post = {
      headline: String(raw.headline || ""),
      caption: String(raw.caption || ""),
      cta_url: String(raw.cta_url || ""),
      tags: String(raw.tags || ""),            // <— avoid array literal issue
      session_id: String(raw.session_id || ""),
      wall_type: String(raw.wall_type || "main"),
      image_url: String(raw.image_url || ""),
      video_url: String(raw.video_url || ""),
      cta_link_url: String(raw.cta_link_url || ""),
      background: String(raw.background || ""),
      sigicon_url: String(raw.sigicon_url || ""),
      display_name: String(raw.display_name || "Jessica AI"),
      session_bg: String(raw.session_bg || ""),
      likes: parseInt(raw.likes ?? "0", 10),
      comments: parseInt(raw.comments ?? "0", 10),
      reposts: parseInt(raw.reposts ?? "0", 10),
    };

    // 🛡️ Optional deduplication (by cta_url or image_url)
    const { data: dupes, error: dupeErr } = await supabase
      .from("jessica_posts")
      .select("id")
      .or(`cta_url.eq.${post.cta_url},image_url.eq.${post.image_url}`)
      .limit(1);

    if (dupeErr) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: dupeErr.message }),
      };
    }

    if (dupes && dupes.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Duplicate post skipped." }),
      };
    }

    // ✅ Insert sanitized post
    const { error } = await supabase
      .from("jessica_posts")
      .insert([post]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Jessica post created." }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Malformed request body" }),
    };
  }
};

export { handler };
