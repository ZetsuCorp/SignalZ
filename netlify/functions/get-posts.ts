import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  const wall_type = event.queryStringParameters?.wall_type;

  if (!wall_type) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing wall_type" }),
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

export { handler };
