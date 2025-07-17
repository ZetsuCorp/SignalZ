export async function fetchJessicaPosts(): Promise<any[]> {
  const session_id = "jessica_" + Date.now();
  const sources = [
    { platform: "youtube", query: "trending on youtube today" },
    { platform: "tiktok", query: "trending on tiktok today" },
    { platform: "instagram", query: "trending on instagram today" },
  ];

  return sources.map(({ platform, query }) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return {
      headline: `Top ${platform} Trends`,
      caption: `Search for ${query}`,
      cta_link_url: url,
      tags: [platform],
      session_id,
      wall_type: ["youtube", "tiktok", "instagram"].includes(platform) ? "alt" : "main",
      image_url: `https://placehold.co/300x200?text=${platform}`,
      video_url: "",
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 40),
      reposts: Math.floor(Math.random() * 10),
    };
  });
}
