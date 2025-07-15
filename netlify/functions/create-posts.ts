// netlify/functions/create-posts.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || "{}");

  const {
    headline,
    caption,
    cta_url,
    image_url,
    video_url,
    tags,
    session_id,
    wall_type,
    background, // ✅ added
    sigicon_url, // ✅
  } = body;

  const { error } = await supabase.from("posts").insert([
    {
      headline,
      caption,
      cta_url,
      image_url,
      video_url,
      tags,
      session_id,
      wall_type,
      background, 
      sigicon_url, // ✅
    },
  ]);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Post created" }),
  };
};

export { handler };
