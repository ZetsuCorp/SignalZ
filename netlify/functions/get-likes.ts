import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  const post_ids = event.queryStringParameters?.post_ids;
  const session_id = event.queryStringParameters?.session_id;

  if (!post_ids) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing post_ids" }),
    };
  }

  const ids = post_ids.split(",");

  // Get counts per post
  const { data: allLikes, error: likesError } = await supabase
    .from("post_likes")
    .select("post_id, session_id")
    .in("post_id", ids);

  if (likesError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: likesError.message }),
    };
  }

  // Build a map: { post_id: { count, liked } }
  const result: Record<string, { count: number; liked: boolean }> = {};
  for (const id of ids) {
    result[id] = { count: 0, liked: false };
  }

  for (const row of allLikes || []) {
    if (result[row.post_id]) {
      result[row.post_id].count++;
      if (session_id && row.session_id === session_id) {
        result[row.post_id].liked = true;
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

export { handler };
