const GAMEZOP_PROPERTY_CODE = process.env.GAMEZOP_PROPERTY_CODE || "UGNYn1MFQ";
const GAMEZOP_API = `https://pub.gamezop.com/v3/games?id=${GAMEZOP_PROPERTY_CODE}`;

exports.handler = async () => {

  try {
    const res = await fetch(GAMEZOP_API);

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
