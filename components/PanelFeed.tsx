import React from "react";

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function isYouTubeOrTikTok(url) {
  return /youtube\.com|youtu\.be|tiktok\.com/.test(url);
}

function getEmbedUrl(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&rel=0` : null;
  }
  if (url.includes("tiktok.com")) {
    const m = url.match(/\/video\/(\d+)/);
    return m ? `https://www.tiktok.com/embed/v2/${m[1]}?autoplay=1` : null;
  }
  return null;
}

export default function PanelFeed({ posts, commentsMap, inputMap, setInputMap, handleCommentSubmit }) {
  return (
    <div
      className="middle-feed"
      style={{
        display: "grid",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "1rem 0",
      }}
    >
      {posts.map((post) => {
        const safeTags = Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === "string"
          ? post.tags.split(",").map((t) => t.trim())
          : [];
        const comments = commentsMap[post.id] || [];
        const bg = post.background;

        return (
          <div
            key={post.id}
            className="frameType"
            style={{
              width: "clamp(360px, 92vw, 420px)",
              aspectRatio: "5 / 7.2",
            }}
          >
            <div
              className="frameType-inner"
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: bg
                  ? `url('/postcard-assets/cardbase/${bg}.png')`
                  : "radial-gradient(120% 100% at 50% 0%, #1a1a1a 0%, #0b0b0b 80%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                padding: "0.75rem",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center" }}>
                {post.display_name && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(0,0,0,0.65)",
                      border: "1px solid #00f0ff55",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      color: "#00f0ff",
                      textShadow: "0 0 6px #00f0ff",
                    }}
                  >
                    {post.display_name}
                  </span>
                )}
              </div>

              {/* Artwork — fixed frame */}
              <div
                className="card-art"
                style={{
                  flex: "0 0 auto",
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  border: "3px solid #00f0ff66",
                  borderRadius: "8px",
                  overflow: "hidden",
                  margin: "0.4rem 0",
                }}
              >
                {post.video_url ? (
                  <video
                    src={post.video_url}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : post.image_url ? (
                  <img
                    src={post.image_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00f0ff88",
                      fontSize: "0.85rem",
                    }}
                  >
                    No Media
                  </div>
                )}
              </div>

              {/* Headline */}
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "1rem",
                  color: "#fff",
                  border: "1px solid #00f0ff55",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  marginBottom: "0.4rem",
                  background: "rgba(0,0,0,0.4)",
                }}
              >
                {post.headline || "Untitled"}
              </div>

              {/* Caption */}
              <div
                style={{
                  background: "rgba(0,10,20,0.65)",
                  border: "1px solid #00f0ff33",
                  borderRadius: "8px",
                  color: "#cfffff",
                  fontSize: "0.8rem",
                  padding: "8px 10px",
                  height: "3.6rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.3",
                  marginBottom: "0.4rem",
                }}
              >
                {post.caption}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  background: "rgba(0,0,0,0.3)",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              >
                <span>❤️ {post.likes || 0}</span>
                <span>💬 {comments.length}</span>
              </div>

              {/* Comments */}
              <div
                style={{
                  marginTop: "0.4rem",
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid #00f0ff22",
                  borderRadius: "8px",
                  padding: "6px 8px",
                  flex: "1 1 auto",
                  overflowY: "auto",
                  maxHeight: "70px",
                }}
              >
                {comments.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.75rem",
                      color: "#cfffff",
                      marginBottom: "2px",
                      lineHeight: "1.2",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    💬 {c.content}
                  </div>
                ))}
              </div>

              {/* Comment box */}
              <div style={{ marginTop: "0.5rem" }}>
                <textarea
                  placeholder="Write a comment..."
                  value={inputMap[post.id] || ""}
                  onChange={(e) =>
                    setInputMap((p) => ({ ...p, [post.id]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "#0d0d0d",
                    color: "#fff",
                    border: "1px solid #00f0ff44",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    padding: "6px",
                    height: "40px",
                    resize: "none",
                    marginBottom: "0.3rem",
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    background: "linear-gradient(to right, #00ff99, #00f0ff)",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "0.75rem",
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
