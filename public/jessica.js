const sources = [
  { platform: "youtube", query: "trending on youtube today" },
  { platform: "tiktok", query: "trending on tiktok today" },
  { platform: "instagram", query: "trending on instagram today" }
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function wallType(platform) {
  const alt = ["youtube", "tiktok", "instagram"];
  return alt.includes(platform) ? "alt" : "main";
}

window.runJessicaReal = async () => {
  const session_id = "jessica_" + Date.now();
  const output = document.getElementById("jessica-output");
  output.innerHTML = "<div class='loading'>🔄 Fetching real sources…</div>";

  // Simulate post generation from search URLs
  const posts = sources.map(({ platform, query }) => {
    const link = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return {
      headline: `Top ${capitalize(platform)} Trends`,
      caption: `Search results for ${platform}`,
      cta_link_url: link,
      tags: [platform],
      session_id,
      wall_type: wallType(platform),
      image_url: `https://placehold.co/300x200?text=${capitalize(platform)}`,
      video_url: "",
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 40),
      reposts: Math.floor(Math.random() * 10),
    };
  });

  output.innerHTML = ""; // Clear loading

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <img src="${post.image_url}" />
      <div><strong>${post.headline}</strong></div>
      <div style="font-size: 12px; color: #00f0ff99;">#${post.tags[0]} → ${post.wall_type}</div>
      <a href="${post.cta_link_url}" target="_blank">🔗 View Post</a>
    `;
    output.appendChild(card);
  });
};
