const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
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

    // 🛡️ Check for existing post by cta_url
    const { data: existingByUrl, error: urlError } = await supabase
      .from('jessica_posts')
      .select('id')
      .eq('cta_url', data.cta_url)
      .limit(1);

    // 🛡️ Check for existing post by image_url
    const { data: existingByImg, error: imgError } = await supabase
      .from('jessica_posts')
      .select('id')
      .eq('image_url', data.image_url)
      .limit(1);

    // Handle fetch errors
    if (urlError || imgError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: urlError?.message || imgError?.message }),
      };
    }

    // Skip if either already exists
    if (
      (existingByUrl && existingByUrl.length > 0) ||
      (existingByImg && existingByImg.length > 0)
    ) {
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
