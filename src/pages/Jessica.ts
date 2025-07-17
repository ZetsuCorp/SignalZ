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
  const alt = ["youtube", "tiktok", "instagram"];
  return alt.includes(platform) ? "alt" : "main";
}

async function fetchGoogleLinks(query) {
  const proxy = "https://corsproxy.io/?";
  const url = proxy + "https://www.google.com/search?q=" + encodeURIComponent(query);

  const res = await fetch(url);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const anchors = Array.from(doc.querySelectorAll("a"));
  const valid = anchors
    .map((a) => {
      const text = a.querySelector("h3")?.innerText || "";
      const href = a.href;
      return text && href.includes("http") ? { title: text, link: href } : null;
    })
    .filter(Boolean)
    .slice(0, 4);

  return valid;
}

window.runJessica = async () => {
  const output = document.getElementById("jessica-output");
  output.innerHTML = "<div class='loading'>🧠 Thinking...</div>";

  const session_id = "jessica_" + Date.now();
  const allPosts = [];

  for (const { platform, query } of sources) {
    const found = await fetchGoogleLinks(query);

    const posts = found.map((result) => ({
      headline: result.title,
      caption: result.link,
      cta_link_url: result.link,
      tags: [platform],
      session_id,
      wall_type: wallType(platform),
      image_url: `https://placehold.co/300x200?text=${capitalize(platform)}`,
      video_url: "",
      likes: Math.floor(Math.random() * 300),
      comments: Math.floor(Math.random() * 50),
      reposts: Math.floor(Math.random() * 25),
    }));

    allPosts.push(...posts);
  }

  output.innerHTML = "";

  allPosts.forEach((post) => {
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
