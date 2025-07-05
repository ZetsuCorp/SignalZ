import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { post_id, content, wall_type } = JSON.parse(event.body)

  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, content, wall_type }])

  if (error) {
    console.error('Comment insert error:', error)
    return { statusCode: 500, body: 'Failed to insert comment' }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data[0]),
  }
}
