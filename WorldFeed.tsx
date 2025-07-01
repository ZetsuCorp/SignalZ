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
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-4 rounded-xl shadow space-y-2 max-w-3xl mx-auto"
        >
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="w-full h-auto rounded"
            />
          )}
          <h3 className="text-lg font-bold">{post.headline}</h3>
          <p className="text-sm text-gray-700">{post.caption}</p>
          {post.cta_url && (
            <a
              href={post.cta_url}
              className="text-blue-500 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.cta_url}
            </a>
          )}
          <div className="text-xs text-gray-400">
            {post.tags.map((tag) => (
              <span key={tag} className="mr-2">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
