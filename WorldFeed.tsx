import React, { useEffect, useState } from "react";

export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/get-posts?wall_type=${wallType}`);
      const data = await res.json();
      setPosts(data || []);
    };
    fetchPosts();
  }, [wallType]);

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500">No posts yet for this wall.</div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-3"
        >
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="w-full h-auto rounded-lg border"
            />
          )}

          <h3 className="text-xl font-bold text-blue-900">{post.headline}</h3>
          <p className="text-gray-700 text-sm">{post.caption}</p>

          {post.cta_url && (
            <a
              href={post.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-yellow-400 px-3 py-1 rounded hover:opacity-90 transition"
            >
              Visit Link
            </a>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 border border-gray-200 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
