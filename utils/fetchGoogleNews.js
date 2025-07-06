const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function fetchGoogleNews() {
  const feed = await parser.parseURL("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en");

  return feed.items.slice(0, 10).map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    source: item.creator || "Google News",
  }));
};
