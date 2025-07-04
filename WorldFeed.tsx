import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed"; // Corrected path for your current folder layout

// Utility: fetch all comments for a post
async function fetchComments(postId) {
  try {
    const res = await fetch(`/.netlify/functions/get-comments?post_id=${postId}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
}

// Utility: post a comment
async function submitComment(postId, content, wallType) {
  const res = await fetch("/.netlify/functions/create-comment", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, content, wall_type: wallType }),
  });
  return res.ok;
}

export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [commentsMap, setCommentsMap] = useState({});
  const [inputMap, setInputMap] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const safeWall = (wallType || "main").toLowerCase();
        const res = await fetch(`/.netlify/functions/get-posts?wall_type=${safeWall}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      }
    };
    fetchPosts();
  }, [wallType]);

  useEffect(() => {
    posts.forEach(async (post) => {
      const comments = await fetchComments(post.id);
      setCommentsMap((prev) => ({ ...prev, [post.id]: comments }));
    });
  }, [posts]);

  const handleCommentSubmit = async (postId) => {
    const content = inputMap[postId];
    if (!content || !content.trim()) return;

    const ok = await submitComment(postId, content, wallType);
    if (ok) {
      const updated = await fetchComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: updated }));
      setInputMap((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {/* Left Panel */}
      <div style={{ width: "20%", background: "#0a0a0a", padding: "1rem", borderRight: "1px solid #222", color: "white" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>🪣 Chum Bucket</h2>
        <p>Coming soon...</p>
      </div>

      {/* Center Feed */}
      <div style={{ flex: 1, padding: "1rem", background: "#0d0d0d" }}>
        {posts.map((post) => {
          const safeTags = Array.isArray(post.tags)
            ? post.tags
            : typeof post.tags === "string"
            ? post.tags.split(",").map((tag) => tag.trim())
            : [];

          const comments = commentsMap[post.id] || [];

          return (
            <div key={post.id} className="post" style={{ marginBottom: "2rem" }}>
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

              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>{post.headline}</h3>
              <p style={{ fontSize: "0.9rem", color: "white", marginBottom: "0.5rem" }}>{post.caption}</p>

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

              {/* Comments Section */}
              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ fontSize: "0.95rem", color: "#00f0ff", marginBottom: "0.25rem" }}>Comments</h4>

                {comments.length > 5 ? (
                  <div
                    className="comment-scroll-wrapper"
                    style={{
                      maxHeight: "120px",
                      overflow: "hidden",
                      position: "relative",
                      maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      className="comment-scroll-inner"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        animation: "scrollComments 10s linear infinite",
                      }}
                    >
                      {comments.map((comment, i) => (
                        <div
                          key={i}
                          className="comment-line"
                          style={{
                            fontSize: "0.85rem",
                            color: "white",
                            padding: "4px 0",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          💬 {comment.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "0.75rem" }}>
                    {comments.map((comment, i) => (
                      <p key={i} style={{ fontSize: "0.85rem", color: "white", marginBottom: "0.4rem" }}>
                        💬 {comment.content}
                      </p>
                    ))}
                  </div>
                )}

                <textarea
                  placeholder="Write a comment..."
                  value={inputMap[post.id] || ""}
                  onChange={(e) => setInputMap((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  style={{
                    width: "100%",
                    background: "#0d0d0d",
                    color: "white",
                    border: "1px solid #00f0ff55",
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(to right, #00ff99, #00f0ff)",
                    color: "black",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Panel (modular NewsFeed) */}
      <div style={{ width: "20%" }}>
        <NewsFeed />
      </div>
    </div>
  );
}
