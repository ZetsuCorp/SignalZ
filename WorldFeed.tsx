// WorldFeed.tsx
import React from "react";
// App.tsx
import React from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import { useState } from "react";


interface Post {
  id: number;
  headline: string;
  caption: string;
  cta_url?: string;
  tags?: string[];
}

const dummyPosts: Post[] = [
  {
    id: 1,
    headline: "WaffleHammer X12",
    caption: "This tool changed everything for me. Lightweight, sharp, iconic.",
    cta_url: "https://wafflehammer.page",
    tags: ["tools", "design", "drop"],
  },
  {
    id: 2,
    headline: "VoidBeats: Synth Pack 8",
    caption: "If you're making darkwave, this pack is your new best friend.",
    tags: ["music", "gear", "soundkit"],
  },
];

export default function WorldFeed({ wallType }: { wallType: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {dummyPosts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold">{post.headline}</h2>
          <p className="mt-2 text-gray-700">{post.caption}</p>
          {post.cta_url && (
            <a
              href={post.cta_url}
              className="text-blue-500 underline mt-2 block"
              target="_blank"
            >
              {post.cta_url}
            </a>
          )}
          {post.tags && (
            <div className="mt-2 text-sm text-gray-500">
              {post.tags.map((tag) => `#${tag}`).join(" ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
