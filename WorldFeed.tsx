import React, { useEffect, useState } from "react";

export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const safeWall = (wallType || "main").toLowerCase();

      try {
        const res = await fetch(`/.netlify/functions/get-posts?wall_type=${safeWall}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      }
    };
    fetchPosts();
  }, [wallType]);

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>
        No posts yet for this wall.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => {
        const safeTags = Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === "string"
          ? post.tags.split(",").map((tag) => tag.trim())
          : [];

        return (
          <div key={post.id || post.headline + post.caption} className="post">
            <div className="post-media">
              {post.video_url ? (
                <video
                  className="auto-pause"
                  controls
                  src={post.video_url}
                />
              ) : post.image_url ? (
                <img
                  src={post.image_url}
                  alt="preview"
                  className="auto-pause"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
              ) : null}
            </div>

            {post.brand && <div className="brand">{post.brand}</div>}

            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{post.headline}</h3>

            <p className="caption">{post.caption}</p>

            {post.cta_url && (
              <a
                href={post.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                Visit Link
              </a>
            )}

            {safeTags.length > 0 && (
              <div className="tag-container">
                {safeTags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
