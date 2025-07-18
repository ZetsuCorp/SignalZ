const { createClient } = require('@supabase/supabase-js');

// Supabase client with environment variables
const supabase = createClient(
 process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // 🛡️ Check for duplicates by cta_url or image_url
    const { data: existing, error: fetchError } = await supabase
      .from('jessica_posts')
      .select('id')
      .or(`cta_url.eq.${data.cta_url},image_url.eq.${data.image_url}`)
      .limit(1);

    if (fetchError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: fetchError.message }),
      };
    }

    if (existing && existing.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Duplicate post skipped.' }),
      };
    }

    // ✅ Insert into Supabase
    const { error } = await supabase
      .from('jessica_posts')
      .insert([data]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Jessica post created successfully.' }),
    };

  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON or malformed request' }),
    };
  }
};

