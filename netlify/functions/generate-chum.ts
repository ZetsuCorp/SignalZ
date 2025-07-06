import { Handler } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"
import { v4 as uuidv4 } from "uuid"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!
const openaiKey = process.env.OPENAI_API_KEY!
const bucket = "chum"

const supabase = createClient(supabaseUrl, supabaseKey)

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    }
  }

  const { prompt, funnel_type = "quiz" } = JSON.parse(event.body || "{}")
  const id = uuidv4()

  if (!prompt || prompt.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt is required." })
    }
  }

  try {
    // ✅ Step 1: Generate image from OpenAI
    const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
        response_format: "url"
      })
    })

    const dalleJson = await dalleRes.json()
    const imageUrl = dalleJson?.data?.[0]?.url
    if (!imageUrl) throw new Error("Failed to generate image from OpenAI")

    // ✅ Step 2: Download image
    const imageBuffer = await (await fetch(imageUrl)).arrayBuffer()

    // ✅ Step 3: Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(`chum/${id}.png`, Buffer.from(imageBuffer), {
        contentType: "image/png",
        upsert: true
      })

    if (uploadError) throw uploadError

    const publicImageUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/chum/${id}.png`

    // ✅ Step 4: Insert metadata into Supabase table
    const { error: insertError } = await supabase
      .from("chum_posts")
      .insert([
        {
          id,
          caption: prompt,
          image_url: publicImageUrl,
          prompt_theme: prompt,
          funnel_type,
          cta_url: null, // To be added later via editor
          status: "ready"
        }
      ])

    if (insertError) throw insertError

    return {
      statusCode: 200,
      body: JSON.stringify({
        id,
        image_url: publicImageUrl,
        message: "Chum generated and saved!"
      })
    }
  } catch (err: any) {
    console.error("generate-chum error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    }
  }
}

export { handler }
