
export async function fetchGoogleNews(topic = "technology") {
  try {
    const res = await fetch(`/.netlify/functions/get-news?q=${encodeURIComponent(topic)}`);
    if (!res.ok) throw new Error("Failed to fetch news");
    return await res.json();
  } catch (err) {
    console.error("Google News fetch error:", err);
    return [];
  }
}
