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

    // 🛡️ Force-cast every field to correct type
    data.headline = String(data.headline || "");
    data.caption = String(data.caption || "");
    data.cta_url = String(data.cta_url || "");
    data.tags = String(data.tags || "");
    data.session_id = String(data.session_id || "");
    data.wall_type = String(data.wall_type || "");
    data.image_url = String(data.image_url || "");
    data.video_url = String(data.video_url || "");
    data.cta_link_url = String(data.cta_link_url || "");
    data.background = String(data.background || "");
    data.sigicon_url = String(data.sigicon_url || "");
    data.display_name = String(data.display_name || "");
    data.session_bg = String(data.session_bg || "");
    data.likes = parseInt(data.likes ?? 0);
    data.comments = parseInt(data.comments ?? 0);
    data.reposts = parseInt(data.reposts ?? 0);

    // 🐛 Optional debug log
    console.log("📦 Jessica incoming post:", data);

    // ✅ Check for duplicates
    const { data: existingByUrl, error: urlError } = await supabase
      .from("jessica_posts")
      .select("id")
      .eq("cta_url", data.cta_url)
      .limit(1);

    const { data: existingByImg, error: imgError } = await supabase
      .from("jessica_posts")
      .select("id")
      .eq("image_url", data.image_url)
      .limit(1);

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

    // ✅ Push to Supabase
    const { error: insertError } = await supabase
      .from("jessica_posts")
      .insert([data]);

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
