const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const post = {
      headline: body.headline || "",
      caption: body.caption || "",
      cta_url: body.cta_url || "",
      cta_link_url: body.cta_link_url || "",
      image_url: body.image_url || "",
      video_url: body.video_url || "",
      tags: parseTags(body.tags),
      session_id: body.session_id || "",
      wall_type: body.wall_type || "main",
      background: body.background || "",
      sigicon_url: body.sigicon_url || "",
      display_name: body.display_name || "Jessica AI",
      session_bg: body.session_bg || "",
      likes: toNumber(body.likes),
      comments: toNumber(body.comments),
      reposts: toNumber(body.reposts),
      search_session: toNumber(body.search_session || 1),
      created_at: new Date().toISOString(),
    };

    // Check for duplicates using filters (safer)
    const { data: dupes, error: dupError } = await supabase
      .from("jessica_posts")
      .select("id")
      .or(`cta_url.eq.${encodeURIComponent(post.cta_url)},image_url.eq.${encodeURIComponent(post.image_url)}`)
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

    // Insert the post
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
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Malformed JSON or unknown error" }),
    };
  }
};

// Helpers
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === "string") {
    return tags.includes(",") ? tags.split(",").map((t) => t.trim()) : [tags];
  }
  return [];
}

function toNumber(val) {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}
