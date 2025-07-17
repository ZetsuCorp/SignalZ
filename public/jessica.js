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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function wallType(platform) {
  const altPlatforms = ["youtube", "tiktok", "snapchat", "instagram"];
  return altPlatforms.includes(platform) ? "alt" : "main";
}

window.runJessicaReal = async () => {
  const session_id = "jessica_" + Date.now();
  const output = document.getElementById("jessica-output");
  output.innerHTML = "<div class='loading'>🔄 Fetching live results...</div>";

  const results = await Promise.all(
    sources.map(async ({ platform, query }) => {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      return {
        headline: `Top ${capitalize(platform)} Content`,
        caption: searchUrl,
        cta_link_url: searchUrl,
        tags: [platform],
        session_id,
        wall_type: wallType(platform),
        image_url: `https://placehold.co/300x200?text=${capitalize(platform)}`,
        video_url: "",
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 50),
        reposts: Math.floor(Math.random() * 25),
      };
    })
  );

  output.innerHTML = ""; // clear loader

  results.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <img src="${post.image_url}" alt="${post.tags[0]}">
      <div><strong>${post.headline}</strong></div>
      <div style="font-size: 12px; color: #00f0ff99;">#${post.tags[0]} → ${post.wall_type}</div>
      <a href="${post.cta_link_url}" target="_blank">🔗 View Post</a>
    `;

    output.appendChild(card);
  });
};
