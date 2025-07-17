import React, { useState } from "react";
import { fetchJessicaPosts } from "../jessica/Jessica";   // returns fakeResults for now
import { supabase } from "../supabase/client";            // adjust path if needed

// Rule-based router → decides wall automatically
const wallMap: Record<string, "main" | "alt"> = {
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
  const [posts, setPosts]   = useState<any[]>([]);
  const [busy,  setBusy]    = useState(false);
  const [saved, setSaved]   = useState(false);

  /* -------------------------------------------------- */
  /* STEP 1 – Generate demo posts & display             */
  /* -------------------------------------------------- */
  const generateDemoPosts = async () => {
    setBusy(true);
    setSaved(false);
    const demo = await fetchJessicaPosts();  // <= fakeResults
    setPosts(demo);
    setBusy(false);
  };

  /* -------------------------------------------------- */
  /* STEP 2 – Save displayed posts to Supabase          */
  /* -------------------------------------------------- */
  const saveToSupabase = async () => {
    if (!posts.length) return;

    setBusy(true);
    for (const post of posts) {
      const platform = post.tags?.[0] || "reddit";
      const wall_type = wallMap[platform] || "main";

      const { error } = await supabase.from("jessica_posts").insert([
        {
          headline: post.headline,
          caption:  post.caption,
          wall_type,
          cta_link_url: post.cta_link_url,
          image_url:   post.image_url,
          video_url:   post.video_url,
          tags:        post.tags,
          likes:       post.likes,
          comments:    post.comments,
          reposts:     post.reposts,
        },
      ]);

      if (error) console.error("❌ Insert failed:", error);
    }
    setBusy(false);
    setSaved(true);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6">🧠 Jessica AI</h1>

      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={generateDemoPosts}
          disabled={busy}
          className="bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-600"
        >
          {busy ? "Working…" : "🔄 Generate Demo Posts"}
        </button>

        <button
          onClick={saveToSupabase}
          disabled={busy || !posts.length}
          className="bg-emerald-400 text-black px-4 py-2 rounded hover:bg-emerald-600"
        >
          💾 Save to Supabase
        </button>
      </div>

      {/* Success notice */}
      {saved && (
        <p className="text-emerald-400 mb-4">✅ Saved to jessica_posts!</p>
      )}

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p, idx) => (
          <div key={idx} className="bg-zinc-900 p-4 rounded-lg shadow-md">
            <img
              src={p.image_url}
              alt={p.tags?.[0]}
              className="w-full h-32 object-cover rounded"
            />
            <div className="mt-2 text-sm text-cyan-300">
              #{p.tags?.[0]} — {wallMap[p.tags?.[0]] || "main"}
            </div>
            <h4 className="font-semibold mt-1">{p.headline}</h4>
            <a
              href={p.cta_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-sm text-black bg-cyan-400 px-3 py-1 rounded hover:bg-cyan-600"
            >
              🔗 View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JessicaPage;
