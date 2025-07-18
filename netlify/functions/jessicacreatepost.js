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
    const body = JSON.parse(event.body || "{}");

    // 🧼 Sanitize + prepare final post
    const post = {
      headline: body.headline || "",
      caption: body.caption || "",
      cta_url: body.cta_url || "",
      tags: parseTags(body.tags),
      session_id: body.session_id || "",
      wall_type: body.wall_type || "main",
      image_url: body.image_url || "",
      video_url: body.video_url || "",
      cta_link_url: body.cta_link_url || "",
      background: body.background || "",
      sigicon_url: body.sigicon_url || "",
      display_name: body.display_name || "Jessica AI",
      session_bg: body.session_bg || "",
      likes: Number(body.likes ?? 0),
      comments: Number(body.comments ?? 0),
      reposts: Number(body.reposts ?? 0),
    };

    // 🔍 Check for duplicates
    const { data: dupes, error: dupError } = await supabase
      .from("jessica_posts")
      .select("id")
      .or(`cta_url.eq.${post.cta_url},image_url.eq.${post.image_url}`)
      .limit(1);

    if (dupError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: dupError.message }),
      };
    }

    if (dupes && dupes.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Duplicate post skipped." }),
      };
    }

    // 🚀 Insert into Supabase
    const { error: insertError } = await supabase
      .from("jessica_posts")
      .insert([post]);

    if (insertError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: insertError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Post created by Jessica." }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Malformed JSON or unknown error" }),
    };
  }
};

// 🎯 Converts raw tags to Postgres text[] array format
function parseTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag));
  if (typeof tags === "string") {
    return tags.includes(",")
      ? tags.split(",").map((t) => t.trim())
      : [tags];
  }
  return [];
}

export { handler };
