// get-comments.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const handler: Handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Supabase environment variables not set." }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const post_id = event.queryStringParameters?.post_id;
  if (!post_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing post_id" }),
    };
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at")
      .eq("post_id", post_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Error fetching comments:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler };
