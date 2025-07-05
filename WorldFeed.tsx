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
            {post.video_url ? (
              <video
                controls
                src={post.video_url}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "0.5rem",
                }}
              />
            ) : post.image_url ? (
              <img
                src={post.image_url}
                alt="preview"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "0.5rem",
                }}
              />
            ) : null}

            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>
              {post.headline}
            </h3>

            <p style={{ fontSize: "0.9rem", color: "white", marginBottom: "0.5rem" }}>
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

            {safeTags.length > 0 && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "white" }}>
                {safeTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-block",
                      background: "#1a1a1a",
                      border: "1px solid #00f0ff55",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "999px",
                      marginRight: "0.5rem",
                      color: "#ffffff",
                    }}
                  >
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
