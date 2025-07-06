const fetchGoogleNews = require("../../utils/fetchGoogleNews");

exports.handler = async function () {
  try {
    const items = await fetchGoogleNews(); // must return an array of news items

    // 👇 ADDITION: If less than 20, try a second source or just extend logic
    if (items.length < 20) {
      const extendedItems = [...items];
      // Fetch a second category to fill the list
      const extraFeed = await fetchGoogleNews("https://news.google.com/rss/headlines/section/topic/WORLD?hl=en&gl=US&ceid=US:en");
      for (let item of extraFeed) {
        if (extendedItems.length >= 20) break;
        extendedItems.push(item);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ items: extendedItems }),
      };
    }

    // Original response if 20 or more already
    return {
      statusCode: 200,
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    console.error("Error fetching Google News:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news" }),
    };
  }
};
