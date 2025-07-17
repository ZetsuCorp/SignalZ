// src/jessica/Jessica.ts

const sources = [
  {
    platform: "youtube",
    query: "trending on youtube today",
  },
  {
    platform: "tiktok",
    query: "trending on tiktok today",
  },
  {
    platform: "instagram",
    query: "trending on instagram today",
  },
];

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function fetchJessicaPosts(): Promise<any[]> {
  const session_id = "jessica_" + Date.now();
  const wall_type = "main";

  const results = await Promise.all(
    sources.map(async ({ platform, query }) => {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      return {
        headline: `Top ${capitalize(platform)} Content`,
        caption: searchUrl,
        cta_link_url: searchUrl,
        tags: [platform],
        session_id,
        wall_type: platform === "youtube" ? "alt" : "main",
        image_url: `https://placehold.co/300x200?text=${capitalize(platform)}`,
        video_url: "",
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 50),
        reposts: Math.floor(Math.random() * 25),
      };
    })
  );

  return results;
}
