import { Handler } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const handler: Handler = async () => {
  try {
    // 🔍 1. Get latest ready chum post
    const { data: chum, error: chumError } = await supabase
      .from("chum_posts")
      .select("*")
      .eq("status", "ready")
      .order("created_at", { ascending: false })
      .limit(1)

    if (chumError) throw chumError
    if (!chum || chum.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No ready chum posts available." })
      }
    }

    const chumPost = chum[0]

    // 📝 2. Insert into SignalZ post system (NO wall_type)
    const { error: insertError } = await supabase
      .from("posts") // Replace if your actual post table has a different name
      .insert([
        {
          caption: chumPost.caption,
          image_url: chumPost.image_url,
          tags: ["chum", "funnel"], // frontend uses this to show in Chum Panel
          funnel_type: chumPost.funnel_type,
          cta_url: chumPost.cta_url
        }
      ])

    if (insertError) throw insertError

    // ✅ 3. Mark chum post as used
    const { error: updateError } = await supabase
      .from("chum_posts")
      .update({ status: "posted" })
      .eq("id", chumPost.id)

    if (updateError) throw updateError

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Chum post added to SignalZ.",
        post_id: chumPost.id
      })
    }
  } catch (err: any) {
    console.error("create-chum-post error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}

export { handler }
