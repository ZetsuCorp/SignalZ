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

    const post = {
      ...body,
      tags: String(body.tags || ""),
      wall_type: String(body.wall_type || ""),
      likes: parseInt(body.likes || 0),
      comments: parseInt(body.comments || 0),
      reposts: parseInt(body.reposts || 0),
    };

    // Insert to jessica_posts table
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
      body: JSON.stringify({ message: "Jessica post created" }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Malformed request" }),
    };
  }
};

export { handler };
