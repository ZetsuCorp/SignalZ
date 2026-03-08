import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { post_id, session_id } = JSON.parse(event.body || "{}");

    if (!post_id || !session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing post_id or session_id" }),
      };
    }

    // Check if already liked
    const { data: existing, error: checkError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("session_id", session_id)
      .maybeSingle();

    if (checkError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: checkError.message }),
      };
    }

    if (existing) {
      // Unlike: remove the row
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: deleteError.message }),
        };
      }
    } else {
      // Like: insert a new row
      const { error: insertError } = await supabase
        .from("post_likes")
        .insert([{ post_id, session_id }]);

      if (insertError) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: insertError.message }),
        };
      }
    }

    // Get updated count
    const { count, error: countError } = await supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post_id);

    if (countError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: countError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        liked: !existing,
        likes: count || 0,
      }),
    };
  } catch (err) {
    console.error("Unexpected error in toggle-like:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { handler };
