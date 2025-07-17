// Sample fakeResults logic (you can replace this with a real import or API call)
const fakeResults = {
  youtube: [
    { title: "MrBeast Drops $1M Video", link: "https://youtube.com/" },
    { title: "Shorts Challenge!", link: "https://youtube.com/" },
  ],
  tiktok: [
    { title: "Viral Dance Move", link: "https://tiktok.com/" },
    { title: "Beauty Filter Hack", link: "https://tiktok.com/" },
  ],
  reddit: [
    { title: "AskReddit Goes Off", link: "https://reddit.com/" },
    { title: "WorldNews Explodes", link: "https://reddit.com/" },
  ],
  linkedin: [
    { title: "CEO Declares War on 9-to-5", link: "https://linkedin.com/" },
    { title: "Gen Z Résumé Trends", link: "https://linkedin.com/" },
  ],
};

// Capitalize utility
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Simulate Jessica’s brain generating post objects
function fetchJessicaPosts() {
  const session_id = "jessica_" + Date.now();
  const wallMap = {
    youtube: "alt",
    tiktok: "alt",
    snapchat: "alt",
    instagram: "alt",
    reddit: "main",
    twitter: "main",
    threads: "main",
    pinterest: "main",
    linkedin: "main",
    facebook: "main",
  };

  return Object.entries(fakeResults).flatMap(([platform, posts]) =>
    posts.map((post) => ({
      headline: post.title,
      caption: post.link,
      cta_link_url: post.link,
      tags: [platform],
      session_id,
      wall_type: wallMap[platform] || "main",
      image_url: `https://placehold.co/300x200?text=${encodeURIComponent(platform)}`,
      video_url: "",
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100),
      reposts: Math.floor(Math.random() * 40),
    }))
  );
}

// Run and render Jessica's posts
window.runJessica = () => {
  const posts = fetchJessicaPosts();
  const output = document.getElementById("jessica-output");
  output.innerHTML = ""; // clear previous

  posts.forEach((post) => {
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
