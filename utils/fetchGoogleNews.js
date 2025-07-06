const Parser = require("rss-parser");
const parser = new Parser();

module.exports = async function fetchGoogleNews() {
  const feed = await parser.parseURL("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en");

  const primaryItems = feed.items.slice(0, 10).map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    source: item.creator || "Google News",
  }));

  // 🔁 ADD: Pull additional articles from another section to reach 20
  const worldFeed = await parser.parseURL("https://news.google.com/rss/headlines/section/topic/WORLD?hl=en&gl=US&ceid=US:en");

  const additionalItems = worldFeed.items.slice(0, 10).map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    source: item.creator || "Google News",
  }));

  // ✨ Combine the two feeds (cutoff at 20 max)
  return [...primaryItems, ...additionalItems].slice(0, 20);
};
