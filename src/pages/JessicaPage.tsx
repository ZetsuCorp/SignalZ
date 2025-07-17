import React, { useState } from "react";
import { fetchJessicaPosts } from "../jessica/Jessica";
import { supabase } from "../supabase/client"; // adjust path if needed

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

const JessicaPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const runJessica = async () => {
    setLoading(true);
    const fetched = await fetchJessicaPosts();
    const inserted = [];

    for (const post of fetched) {
      const platform = post.tags?.[0] || "reddit";
      const wall_type = wallMap[platform] || "main";

      const { data, error } = await supabase.from("jessica_posts").insert([
        {
          headline: post.headline,
          caption: post.caption,
          wall_type,
          cta_link_url: post.cta_link_url,
          image_url: post.image_url,
          video_url: post.video_url,
          tags: post.tags,
          likes: post.likes,
          comments: post.comments,
          reposts: post.reposts,
        },
      ]).select("*");

      if (error) {
        console.error("❌ Insert failed:", error);
      } else {
        inserted.push(...data);
      }
    }

    setPosts(inserted);
    setLoading(false);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">🧠 Jessica AI</h1>

      <button
        onClick={runJessica}
        disabled={loading}
        className="bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-600 transition"
      >
        {loading ? "Fetching..." : "🔄 Fetch & Save Posts"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-zinc-900 p-4 rounded-lg shadow-md">
            <img src={post.image_url} alt={post.tags?.[0]} className="w-full h-32 object-cover rounded" />
            <div className="mt-3 text-sm text-cyan-300">#{post.tags?.[0]} — {post.wall_type}</div>
            <h4 className="font-semibold mt-1">{post.headline}</h4>
            <a
              href={post.cta_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-sm text-black bg-cyan-400 px-3 py-1 rounded hover:bg-cyan-600"
            >
              🔗 View Post
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JessicaPage;
