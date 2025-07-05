const Parser = require("rss-parser");
const parser = new Parser();

exports.handler = async function () {
  try {
    const feed = await parser.parseURL("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en");

    const items = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
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
    console.error("RSS fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news RSS." }),
    };
  }
};
