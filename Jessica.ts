// src/jessica/Jessica.ts

const fakeResults = {
  reddit: [
    { title: "r/AskReddit Explodes With Opinions", link: "https://reddit.com/..." },
    { title: "r/WorldNews Trending Thread", link: "https://reddit.com/..." },
  ],
  twitter: [
    { title: "Elon Says Something Again", link: "https://twitter.com/..." },
    { title: "#WorldWarZ Trends", link: "https://twitter.com/..." },
  ],
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function fetchJessicaPosts() {
  const session_id = "jessica_" + Date.now();
  const wall_type = "main";

  return Object.entries(fakeResults).flatMap(([platform, posts]) =>
    posts.map(post => ({
      headline: post.title,
      caption: post.link,
      cta_link_url: post.link,
      tags: [platform],
      session_id,
      wall_type,
      image_url: `https://placehold.co/300x200?text=${encodeURIComponent(capitalize(platform))}`,
      video_url: "",
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 40),
      reposts: Math.floor(Math.random() * 15),
    }))
  );
}
