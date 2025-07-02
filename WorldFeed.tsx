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
      <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>
        No posts yet for this wall.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "0.5rem",
              }}
            />
          )}

          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#003366" }}>
            {post.headline}
          </h3>

          <p style={{ fontSize: "0.9rem", color: "#333", marginBottom: "0.5rem" }}>
            {post.caption}
          </p>

          {post.cta_url && (
            <a
              href={post.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(to right, #ff4136, #ffdc00)",
                color: "white",
                padding: "0.4rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                textDecoration: "none",
                marginBottom: "0.5rem",
              }}
            >
              Visit Link
            </a>
          )}

          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#777" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    background: "#f0f0f0",
                    border: "1px solid #ccc",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "999px",
                    marginRight: "0.5rem",
                  }}
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
