import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, session_id, wall_type } = JSON.parse(event.body!);

    if (!url || !session_id || !wall_type) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    const { data, error } = await supabase.from('posts').insert([
      {
        cta_url: url,
        session_id,
        wall_type,
        headline: '🔥 Link Drop',
        caption: 'User shared a link',
        image_url: null,
        video_url: null,
        tags: ['link']
      }
    ]);

    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    console.error('Error creating link post:', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};

export { handler };
