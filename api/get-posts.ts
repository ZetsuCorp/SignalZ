// api/get-posts.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { wall_type } = req.query;

  if (!wall_type || typeof wall_type !== "string") {
    return res.status(400).json({ error: "Missing or invalid wall_type" });
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, headline, caption, cta_url, tags, session_id, wall_type, image_url, video_url, created_at`
    )
    .eq("wall_type", wall_type)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
