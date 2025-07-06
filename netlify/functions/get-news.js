
const fetchGoogleNews = require("../../utils/fetchGoogleNews");

exports.handler = async function () {
  try {
    const items = await fetchGoogleNews(); // must return an array of news items
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
