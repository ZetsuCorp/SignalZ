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

    // 🛡️ Force-cast any problematic fields to prevent malformed array issues
    data.tags = String(data.tags);
    data.wall_type = String(data.wall_type);

    // 🐛 Optional: Log for debug
    console.log("📦 Jessica incoming post:", data);

    // Check for existing by cta_url
    const { data: existingByUrl, error: urlError } = await supabase
      .from("jessica_posts")
      .select("id")
      .eq("cta_url", data.cta_url)
      .limit(1);

    // Check for existing by image_url
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

    // ✅ Insert the new post
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
