const { createClient } = require('@supabase/supabase-js');

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
    const data = JSON.parse(event.body || "{}");

    // ✅ Normalize every expected field
    const post = {
      headline: String(data.headline || ""),
      caption: String(data.caption || ""),
      cta_url: String(data.cta_url || ""),
      tags: String(data.tags || ""),
      session_id: String(data.session_id || ""),
      wall_type: String(data.wall_type || ""),
      image_url: String(data.image_url || ""),
      video_url: String(data.video_url || ""),
      cta_link_url: String(data.cta_link_url || ""),
      background: String(data.background || ""),
      sigicon_url: String(data.sigicon_url || ""),
      display_name: String(data.display_name || ""),
      session_bg: String(data.session_bg || ""),
      likes: parseInt(data.likes || 0),
      comments: parseInt(data.comments || 0),
      reposts: parseInt(data.reposts || 0),
    };

    console.log("📦 Jessica post being inserted:", post);

    // 🧠 Check for duplicates
    const [{ data: existingByUrl, error: urlError }, { data: existingByImg, error: imgError }] = await Promise.all([
      supabase.from("jessica_posts").select("id").eq("cta_url", post.cta_url).limit(1),
      supabase.from("jessica_posts").select("id").eq("image_url", post.image_url).limit(1),
    ]);

    if (urlError || imgError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: urlError?.message || imgError?.message,
        }),
      };
    }

    if (
      (existingByUrl && existingByUrl.length > 0) ||
      (existingByImg && existingByImg.length > 0)
    ) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Duplicate post skipped." }),
      };
    }

    // 🚀 Insert the sanitized post
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
      body: JSON.stringify({ message: "Jessica post created successfully." }),
    };

  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON or malformed request" }),
    };
  }
};
