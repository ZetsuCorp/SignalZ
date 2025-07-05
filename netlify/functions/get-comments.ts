
// get-comments.ts
import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
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

    if (error) throw error;

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
