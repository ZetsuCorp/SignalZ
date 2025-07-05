const fetch = require("node-fetch");

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CUSTOM_CX;

exports.handler = async function (event) {
  const topic = event.queryStringParameters?.q || "technology";
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    topic
  )}&cx=${CX}&key=${API_KEY}&num=10`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const items = (json.items || []).map((item) => ({
      title: item.title || "No title",
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      image:
        item.pagemap?.cse_image?.[0]?.src ||
        item.pagemap?.metatags?.[0]["og:image"] ||
        null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=600",
      },
    };
  } catch (err) {
    console.error("Error fetching Google News JSON:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news." }),
    };
  }
};
