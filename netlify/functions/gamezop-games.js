const GAMEZOP_API = "https://api.gamezop.com/v3/games";
const BEARER_TOKEN =
  process.env.GAMEZOP_BEARER_TOKEN || "9f45e8c3-0180-458c-a77c-d345316c19dd";

exports.handler = async () => {

  try {
    const res = await fetch(GAMEZOP_API, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `Gamezop API returned ${res.status}` }),
      };
    }

    const json = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    };
  } catch (err) {
    console.error("Gamezop proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch games from Gamezop" }),
    };
  }
};
