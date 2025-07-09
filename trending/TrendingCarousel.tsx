import React from "react";

export default function TrendingCarousel({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="trending-carousel-container w-full bg-black py-4 px-6 border-b border-zinc-800">
      <div className="carousel-track flex gap-4 overflow-x-auto hide-scrollbar">
        {posts.map((post, index) => (
          <div
            key={post.id || index}
            className="trend-post min-w-[250px] bg-zinc-900 rounded-2xl p-4 shadow-md border border-zinc-700 flex-shrink-0"
          >
            {/* 🏅 Rank Badge */}
            <div className="rank-badge text-sm text-center text-yellow-400 mb-2">
              {["🥇 1st", "🥈 2nd", "🥉 3rd", "🏅 4th", "🏅 5th"][index]}
            </div>

            {/* 📹 Media */}
            {post.video_url ? (
              <video
                className="trend-video w-full h-auto rounded-md mb-2"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={post.video_url} type="video/mp4" />
              </video>
            ) : (
              <img
                className="trend-image w-full h-auto rounded-md mb-2"
                src={post.image_url}
                alt={post.link_title || "Trending Post"}
              />
            )}

            {/* 📄 Content */}
            <div className="trend-title text-white font-semibold text-sm truncate">
              {post.link_title || "Untitled"}
            </div>
            <div className="trend-caption text-zinc-400 text-xs truncate">
              {post.url || "No URL"}
            </div>

            {/* 🔗 CTA */}
            {post.cta_link_url && (
              <a
                className="trend-cta block text-xs text-sky-400 mt-2 hover:underline"
                href={post.cta_link_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.cta_link_url.includes("watch")
                  ? "Watch in Action"
                  : "See This Trend"}
              </a>
            )}

            {/* 🏷 Tags */}
            {post.tags && (
              <div className="trend-tags text-xs text-zinc-500 mt-1 truncate">
                {Array.isArray(post.tags) ? post.tags.join(", ") : post.tags}
              </div>
            )}

            {/* 📊 Stats */}
            <div className="social-stats flex justify-between text-xs text-zinc-400 mt-2">
              <div className="stat-badge">❤️ {post.likes || 0}</div>
              <div className="stat-badge">💬 {post.comments || 0}</div>
              <div className="stat-badge">🔁 {post.reposts || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
