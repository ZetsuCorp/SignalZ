import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables not set.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { post_id, content, wall_type } = JSON.parse(event.body);

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id, content, wall_type }]);

    if (error || !data || !data[0]) {
      console.error('Comment insert error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to insert comment' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data[0]),
    };
  } catch (err) {
    console.error('Unexpected error in create-comment:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
