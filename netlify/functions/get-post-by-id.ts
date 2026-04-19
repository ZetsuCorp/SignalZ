import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing id" }),
    };
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, session_id, background, sigicon_url, display_name")
    .eq("id", id)
    .maybeSingle();

  if (postError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: postError.message }),
    };
  }

  if (post) {
    return {
      statusCode: 200,
      body: JSON.stringify(post),
    };
  }

  const { data: link, error: linkError } = await supabase
    .from("linked_posts")
    .select("*, sigicon_url")
    .eq("id", id)
    .maybeSingle();

  if (linkError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: linkError.message }),
    };
  }

  if (!link) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Post not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ...link, isLinkPost: true }),
  };
};

export { handler };
