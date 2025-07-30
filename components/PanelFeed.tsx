import React from "react";
import { extractDomain, isYouTubeOrTikTok, getEmbedUrl } from "./src/utils/helpers";

export default function PanelFeed({ posts, commentsMap, inputMap, setInputMap, handleCommentSubmit }) {
  return (
    <div className="middle-feed">
      {/* 🔁 Begin rendering posts */}
      {posts.map((post) => {
        const safeTags = Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === "string"
          ? post.tags.split(",").map((tag) => tag.trim())
          : [];

        const comments = commentsMap[post.id] || [];
        const bg = post.background;
        if (!bg) console.warn("⚠️ Missing background for post ID:", post.id);

        return (
          <div
            key={post.id}
            className="post shadow-xl"
            style={{
              marginBottom: "2rem",
              backgroundImage: bg
                ? `url('/postcard-assets/cardbase/${bg}.png')`
                : "repeating-linear-gradient(45deg, #222, #111 10px)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "16px",
              border: "4px solid rgba(0, 255, 255, 0.5)",
              boxShadow: "0 0 15px #00f0ff55",
              padding: "1.5rem",
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* Holo overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,255,255,0.08) 100%)",
                zIndex: 0,
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />

            {/* TCG Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Display Name */}
              {post.display_name && (
                <div style={{ width: "100%", textAlign: "center", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      color: "#00f0ff",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      textShadow: "0 0 6px #00f0ff",
                      display: "inline-block",
                    }}
                  >
                    {post.display_name}
                  </span>
                </div>
              )}

              {/* Title */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0ff, #033)",
                  border: "2px solid #00f0ff88",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  textShadow: "0 0 2px #0ff, 0 0 5px #0ff",
                  boxShadow:
                    "inset 0 2px 5px rgba(255,255,255,0.2), inset 0 -2px 5px rgba(0,0,0,0.3), 0 4px 8px rgba(0,255,255,0.2)",
                  margin: "0.5rem 0 0.75rem",
                }}
              >
                📛 {post.headline}
              </div>

              {/* Subtype */}
              <div style={{ fontSize: "0.85rem", color: "#ccc", marginBottom: "1rem" }}>
                📂 Type — SIGZICON
              </div>

              {/* Media */}
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

              {/* Sigicon */}
              {post.sigicon_url && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    left: "0.5rem",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3px",
                  }}
                >
                  <img
                    src={post.sigicon_url}
                    alt="Signal Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              {/* Caption */}
              <div
                style={{
                  background: "rgba(0, 10, 20, 0.65)",
                  border: "1px solid #00f0ff44",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "#e0fefe",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  marginBottom: "0.75rem",
                }}
              >
                {post.caption && (
                  <p style={{ fontSize: "0.85rem", color: "#cfffff", marginBottom: "0.5rem" }}>
                    {post.caption}
                  </p>
                )}
                {post.created_at && (
                  <div style={{ fontSize: "0.75rem", color: "#88ffff" }}>
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Link preview */}
              {safeTags.includes("link") && post.caption?.startsWith("http") &&
                (isYouTubeOrTikTok(post.caption) && getEmbedUrl(post.caption) ? (
                  <iframe
                    src={getEmbedUrl(post.caption)}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      width: "100%",
                      aspectRatio: "9 / 16",
                      maxHeight: "600px",
                      borderRadius: "10px",
                      border: "1px solid #00f0ff44",
                      marginTop: "0.5rem",
                    }}
                  />
                ) : (
                  <a
                    href={post.caption}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      border: "1px solid #00f0ff44",
                      borderRadius: "12px",
                      padding: "1rem",
                      backgroundColor: "#0f0f0f",
                      marginTop: "0.5rem",
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                      {post.headline || "Shared via SignalZ"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#ccc" }}>
                      {extractDomain(post.caption)}
                    </div>
                  </a>
                ))}

              {/* CTA */}
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

              {/* Stats */}
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  color: "white",
                  background: "rgba(0,0,0,0.3)",
                  padding: "6px 10px",
                  borderRadius: "10px",
                }}
              >
                <div>❤️ Likes: {post.likes || 0}</div>
                <div>💬 Comments: {comments.length || 0}</div>
              </div>

              {/* Tags */}
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

              {/* Comments + Input */}
              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ fontSize: "0.95rem", color: "#00f0ff", marginBottom: "0.25rem" }}>Comments</h4>
                {comments.map((comment, i) => (
                  <p key={i} style={{ fontSize: "0.85rem", color: "white", marginBottom: "0.4rem" }}>
                    💬 {comment.content}
                  </p>
                ))}
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
          </div>
        );
      })}
    </div>
  );
}
