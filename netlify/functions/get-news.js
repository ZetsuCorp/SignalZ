const fetch = require("node-fetch");
const xml2js = require("xml2js");

exports.handler = async function (event, context) {
  const topic = event.queryStringParameters.q || "technology"; // fallback topic
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}`;

  try {
    const response = await fetch(rssUrl);
    const xml = await response.text();

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const items = result.rss.channel[0].item || [];

    const news = items.map((item) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate ? item.pubDate[0] : null,
      source: item.source ? item.source[0]._ : null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(news),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=600", // Cache 10 min
      },
    };
  } catch (err) {
    console.error("Error fetching Google News:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news." }),
    };
  }
};
