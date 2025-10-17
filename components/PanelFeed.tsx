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

export default function PanelFeed({
  posts,
  commentsMap,
  inputMap,
  setInputMap,
  handleCommentSubmit,
}) {
  return (
    <div className="middle-feed" style={{ display: "grid", placeItems: "center" }}>
      {posts.map((post) => {
        const safeTags = Array.isArray(post.tags)
          ? post.tags
          : typeof post.tags === "string"
          ? post.tags.split(",").map((t) => t.trim())
          : [];
        const comments = commentsMap[post.id] || [];
        const bg = post.background;

        return (
          <div key={post.id} className="frameType" style={{ marginBottom: "1.5rem" }}>
            <div
              className="frameType-inner"
              style={{
                backgroundImage: bg
                  ? `url('/postcard-assets/cardbase/${bg}.png')`
                  : "radial-gradient(120% 100% at 50% 0%, #1a1a1a 0%, #0b0b0b 80%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "1rem",
              }}
            >
              {/* display name */}
              {post.display_name && (
                <div style={{ textAlign: "center", marginBottom: "0.4rem" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      color: "#00f0ff",
                      background: "rgba(0,0,0,0.6)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      textShadow: "0 0 6px #00f0ff",
                    }}
                  >
                    {post.display_name}
                  </span>
                </div>
              )}

              {/* headline */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#fff",
                  border: "2px solid #00f0ff66",
                  borderRadius: "8px",
                  background: "linear-gradient(145deg, #0ff2, #033)",
                  padding: "6px 10px",
                  marginBottom: "0.5rem",
                }}
              >
                📛 {post.headline}
              </div>

              {/* media */}
              {post.video_url ? (
                <video
                  controls
                  src={post.video_url}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "0.6rem",
                  }}
                />
              ) : post.image_url ? (
                <img
                  src={post.image_url}
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "0.6rem",
                  }}
                />
              ) : null}

              {/* caption */}
              {post.caption && (
                <div
                  style={{
                    background: "rgba(0,10,20,0.65)",
                    border: "1px solid #00f0ff44",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    color: "#cfffff",
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                    marginBottom: "0.6rem",
                  }}
                >
                  {post.caption}
                </div>
              )}

              {/* embedded link */}
              {safeTags.includes("link") &&
                post.caption?.startsWith("http") &&
                (isYouTubeOrTikTok(post.caption) && getEmbedUrl(post.caption) ? (
                  <iframe
                    src={getEmbedUrl(post.caption)}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      width: "100%",
                      aspectRatio: "9/16",
                      borderRadius: "8px",
                      border: "1px solid #00f0ff44",
                      marginBottom: "0.6rem",
                    }}
                  />
                ) : (
                  <a
                    href={post.caption}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      border: "1px solid #00f0ff44",
                      borderRadius: "8px",
                      padding: "10px",
                      background: "#0f0f0f",
                      textDecoration: "none",
                      color: "#fff",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>
                      {post.headline || "Shared via SignalZ"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#ccc" }}>
                      {extractDomain(post.caption)}
                    </div>
                  </a>
                ))}

              {/* cta */}
              {post.cta_url && (
                <a
                  href={post.cta_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(to right, #ff4136, #ffdc00)",
                    color: "#000",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    marginBottom: "0.6rem",
                  }}
                >
                  Visit Link
                </a>
              )}

              {/* stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  background: "rgba(0,0,0,0.3)",
                  padding: "5px 8px",
                  borderRadius: "8px",
                  color: "#fff",
                  marginBottom: "0.5rem",
                }}
              >
                <div>❤️ {post.likes || 0}</div>
                <div>💬 {comments.length}</div>
              </div>

              {/* tags */}
              {safeTags.length > 0 && (
                <div style={{ marginBottom: "0.6rem" }}>
                  {safeTags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "inline-block",
                        background: "#1a1a1a",
                        border: "1px solid #00f0ff55",
                        padding: "2px 6px",
                        borderRadius: "999px",
                        color: "#fff",
                        fontSize: "0.75rem",
                        marginRight: "0.4rem",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* comments */}
              <div>
                <h4 style={{ fontSize: "0.9rem", color: "#00f0ff" }}>Comments</h4>
                {comments.map((c, i) => (
                  <p key={i} style={{ fontSize: "0.8rem", color: "#fff" }}>
                    💬 {c.content}
                  </p>
                ))}
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
                    border: "1px solid #00f0ff55",
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "0.8rem",
                    marginBottom: "0.4rem",
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  style={{
                    padding: "8px 14px",
                    background: "linear-gradient(to right, #00ff99, #00f0ff)",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "700",
                    fontSize: "0.8rem",
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
