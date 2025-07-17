// src/pages/JessicaPage.tsx
import React, { useState } from 'react';
import { fetchJessicaPosts } from '../jessica/Jessica';

const JessicaPage = () => {
  const [posts, setPosts] = useState([]);

  const handleFetch = async () => {
    const fetched = await fetchJessicaPosts();
    setPosts(fetched);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📡 Jessica AI — Post Collector</h2>
      <button
        onClick={handleFetch}
        className="bg-cyan-400 text-black px-4 py-2 rounded hover:bg-cyan-600 transition"
      >
        🔄 Fetch Posts
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-zinc-900 p-4 rounded-lg shadow-md">
            <img src={post.image_url} alt={post.tags[0]} className="w-full h-32 object-cover rounded" />
            <div className="mt-3 text-sm text-cyan-300">#{post.tags[0]}</div>
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
