import React, { useState } from "react";

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

export default function PanelFeed({ posts, commentsMap, inputMap, setInputMap, handleCommentSubmit, likesMap, handleLikeToggle }) {
  const [pausedPosts, setPausedPosts] = useState<Record<string, boolean>>({});
  const [pausedCaptions, setPausedCaptions] = useState<Record<string, boolean>>({});

  const togglePause = (postId: string) => {
    setPausedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const togglePauseCaption = (postId: string) => {
    setPausedCaptions((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const CAPTION_SCROLL_THRESHOLD = 140;

  return (
    <>
      <style>{`
        @keyframes scrollComments {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollCaption {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
      `}</style>

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
          const likeData = likesMap?.[post.id] || { count: 0, liked: false };

          return (
            <div
              key={post.id}
              className="frameType"
              style={{
                width: "clamp(360px, 92vw, 420px)",
                aspectRatio: "5 / 7.8",
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
                        background: "rgba(0, 5, 12, 0.85)",
                        border: "2px solid rgba(0, 240, 255, 0.65)",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#00f0ff",
                        textShadow: "0 0 6px #00f0ff",
                        boxShadow: "0 0 8px rgba(0, 240, 255, 0.2), inset 0 0 6px rgba(0, 0, 0, 0.4)",
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
                    marginBottom: post.cta_url ? "0.25rem" : "0.4rem",
                    background: "rgba(0,0,0,0.4)",
                  }}
                >
                  {post.headline || "Untitled"}
                </div>

                {/* Visit Link */}
                {post.cta_url && (
                  <div style={{ textAlign: "center", marginBottom: "0.4rem" }}>
                    <a
                      href={post.cta_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 14px",
                        background: "linear-gradient(to right, #00ff99, #00f0ff)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#000",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      🔗 Visit Link
                    </a>
                  </div>
                )}

                {/* Caption */}
                {(() => {
                  const captionText = post.caption || "";
                  const captionLong = captionText.length > CAPTION_SCROLL_THRESHOLD;
                  const captionPaused = pausedCaptions[post.id];
                  const captionDuration = Math.max(12, Math.ceil(captionText.length / 12));
                  return (
                    <div
                      className="caption-scroll-wrapper"
                      onClick={() => captionLong && togglePauseCaption(post.id)}
                      style={{
                        background: "rgba(0,10,20,0.65)",
                        border: "1px solid #00f0ff33",
                        borderRadius: "8px",
                        color: "#cfffff",
                        fontSize: "0.8rem",
                        height: "6.2rem",
                        overflow: "hidden",
                        position: "relative",
                        lineHeight: "1.3",
                        marginBottom: "0.4rem",
                        cursor: captionLong ? "pointer" : "default",
                        ...(captionLong
                          ? {
                              maskImage:
                                "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                              WebkitMaskImage:
                                "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                            }
                          : {}),
                      }}
                    >
                      {captionLong && captionPaused && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                            background: "rgba(0,0,0,0.6)",
                            color: "#00f0ff",
                            fontSize: "0.65rem",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid #00f0ff44",
                            pointerEvents: "none",
                          }}
                        >
                          Tap to resume
                        </div>
                      )}
                      <div
                        className="caption-scroll-inner"
                        style={{
                          animation:
                            captionLong && !captionPaused
                              ? `scrollCaption ${captionDuration}s linear infinite`
                              : "none",
                        }}
                      >
                        <div style={{ padding: "8px 10px", whiteSpace: "pre-wrap" }}>
                          {captionText}
                        </div>
                        {captionLong && (
                          <div
                            style={{
                              padding: "8px 10px",
                              whiteSpace: "pre-wrap",
                              marginTop: "0.4rem",
                            }}
                          >
                            {captionText}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.4)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    color: "#fff",
                    gap: "1rem",
                    marginTop: "0.3rem",
                  }}
                >
                  <span
                    onClick={() => handleLikeToggle?.(post.id)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: likeData.liked
                        ? "rgba(255, 60, 80, 0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: likeData.liked
                        ? "1px solid rgba(255, 60, 80, 0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>
                      {likeData.liked ? "❤️" : "🤍"}
                    </span>
                    <span style={{ fontWeight: 600 }}>{likeData.count}</span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: comments.length > 0
                        ? "rgba(0, 240, 255, 0.1)"
                        : "rgba(255,255,255,0.05)",
                      border: comments.length > 0
                        ? "1px solid rgba(0, 240, 255, 0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>💬</span>
                    <span style={{ fontWeight: 600 }}>{comments.length}</span>
                  </span>
                </div>

                {/* Cascading Scrolling Comment Bars */}
                <div
                  className="comment-scroll-wrapper"
                  onClick={() => comments.length >= 2 && togglePause(post.id)}
                  style={{
                    maxHeight: comments.length >= 2 ? "110px" : "auto",
                    overflow: "hidden",
                    position: "relative",
                    marginTop: "0.4rem",
                    cursor: comments.length >= 2 ? "pointer" : "default",
                    ...(comments.length >= 2
                      ? {
                          maskImage:
                            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                        }
                      : {}),
                  }}
                >
                  {comments.length >= 2 && pausedPosts[post.id] && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        background: "rgba(0,0,0,0.6)",
                        color: "#00f0ff",
                        fontSize: "0.65rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        border: "1px solid #00f0ff44",
                        pointerEvents: "none",
                      }}
                    >
                      Tap to resume
                    </div>
                  )}
                  <div
                    className="comment-scroll-inner"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      animation:
                        comments.length >= 2 && !pausedPosts[post.id]
                          ? `scrollComments ${Math.max(8, comments.length * 2)}s linear infinite`
                          : "none",
                    }}
                  >
                    {(comments.length >= 2
                      ? [...comments, ...comments]
                      : comments.length > 0
                        ? [comments[0]]
                        : []
                    ).map((c, i) => (
                      <div
                        key={i}
                        className="comment-line"
                        style={{
                          fontSize: "0.72rem",
                          color: "#cfffff",
                          padding: "3px 8px",
                          background: "rgba(0, 240, 255, 0.06)",
                          border: "1px solid rgba(0, 240, 255, 0.15)",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        💬 {c.content}
                      </div>
                    ))}
                  </div>
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
    </>
  );
}
