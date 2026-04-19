import React, { useEffect, useState, useCallback, useRef } from "react";

const CAPTION_SCROLL_THRESHOLD = 140;

async function fetchPostById(id) {
  try {
    const res = await fetch(`/.netlify/functions/get-post-by-id?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchComments(postId) {
  try {
    const res = await fetch(`/.netlify/functions/get-comments?post_id=${postId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchLikes(postId) {
  try {
    const sessionId = localStorage.getItem("session_id") || "";
    const res = await fetch(
      `/.netlify/functions/get-likes?post_ids=${postId}&session_id=${encodeURIComponent(sessionId)}`
    );
    if (!res.ok) return { count: 0, liked: false };
    const data = await res.json();
    return data[postId] || { count: 0, liked: false };
  } catch {
    return { count: 0, liked: false };
  }
}

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

export default function PostShareOverlay({ postId, initialPost, onClose }) {
  const [post, setPost] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [likeData, setLikeData] = useState({ count: 0, liked: false });
  const [commentInput, setCommentInput] = useState("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    const rotateX = ((y / rect.height) - 0.5) * -20;
    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    el.style.boxShadow = "0 20px 40px rgba(0, 240, 255, 0.35)";
  };

  const handleCardMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.boxShadow = "0 0 20px rgba(0,0,0,0.7)";
  };

  useEffect(() => {
    let cancelled = false;
    if (!initialPost && postId) {
      setLoading(true);
      fetchPostById(postId).then((p) => {
        if (cancelled) return;
        if (!p || p.error) {
          setNotFound(true);
        } else {
          setPost(p);
        }
        setLoading(false);
      });
    } else if (initialPost) {
      setPost(initialPost);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [postId, initialPost]);

  useEffect(() => {
    if (!post?.id) return;
    let cancelled = false;
    (async () => {
      const [c, l] = await Promise.all([fetchComments(post.id), fetchLikes(post.id)]);
      if (cancelled) return;
      setComments(c || []);
      setLikeData(l);
    })();
    return () => {
      cancelled = true;
    };
  }, [post?.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    const url = `${window.location.origin}${window.location.pathname}#post/${postId}`;
    try {
      await navigator.share({ title: post?.headline || "Post", url });
    } catch {}
  }, [postId, post?.headline]);

  const handleLikeToggle = async () => {
    if (!post?.id) return;
    const sessionId = localStorage.getItem("session_id") || "";
    if (!sessionId) return;
    setLikeData((prev) => ({
      count: prev.liked ? prev.count - 1 : prev.count + 1,
      liked: !prev.liked,
    }));
    try {
      const res = await fetch("/.netlify/functions/toggle-like", {
        method: "POST",
        body: JSON.stringify({ post_id: post.id, session_id: sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikeData({ count: data.likes, liked: data.liked });
      }
    } catch {}
  };

  const handleSubmitComment = async () => {
    if (!post?.id || !commentInput.trim()) return;
    try {
      const res = await fetch("/.netlify/functions/create-comment", {
        method: "POST",
        body: JSON.stringify({
          post_id: post.id,
          content: commentInput,
          wall_type: post.wall_type,
        }),
      });
      if (res.ok) {
        setCommentInput("");
        const fresh = await fetchComments(post.id);
        setComments(fresh || []);
      }
    } catch {}
  };

  const backdropStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(6px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "12px",
    right: "14px",
    background: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(0, 240, 255, 0.4)",
    color: "#00f0ff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    fontSize: "1rem",
    cursor: "pointer",
    zIndex: 2,
  };

  if (loading) {
    return (
      <div style={backdropStyle} onClick={onClose}>
        <div style={{ color: "#00f0ff" }}>Loading…</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={backdropStyle} onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#0b1a22",
            border: "1px solid #00f0ff44",
            borderRadius: "10px",
            padding: "1.5rem 2rem",
            color: "#cfffff",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "0.8rem" }}>Post not found.</div>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(to right, #00ff99, #00f0ff)",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              padding: "6px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const bg = post.background;
  const captionText = post.caption || "";
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div
        className="post-share-overlay-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#05121a",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          borderRadius: "12px",
          boxShadow: "0 0 40px rgba(0, 240, 255, 0.15)",
          width: "min(980px, 100%)",
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <button aria-label="Close" onClick={onClose} style={closeBtnStyle}>
          ✕
        </button>

        <div
          className="post-share-layout"
          style={{
            display: "flex",
            width: "100%",
            maxHeight: "92vh",
          }}
        >
          {/* Left: card */}
          <div
            className="post-share-card-pane"
            style={{
              flex: "0 0 auto",
              width: "clamp(300px, 42%, 440px)",
              background: "#000",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid rgba(0, 240, 255, 0.15)",
              perspective: "1200px",
            }}
          >
            <div
              ref={cardRef}
              className="frameType"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onPointerLeave={handleCardMouseLeave}
              style={{
                width: "100%",
                aspectRatio: "5 / 7.8",
                maxHeight: "calc(92vh - 2rem)",
                transform: "rotateX(0deg) rotateY(0deg) scale(1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transformStyle: "preserve-3d",
                willChange: "transform",
                boxShadow: "0 0 20px rgba(0,0,0,0.7)",
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
                  borderRadius: "10px",
                }}
              >
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
                      }}
                    >
                      {post.display_name}
                    </span>
                  )}
                </div>

                <div
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
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : post.image_url ? (
                    <img
                      src={post.image_url}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

                <div
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
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
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      🔗 Visit Link
                    </a>
                  </div>
                )}

                {captionText && (
                  <div
                    style={{
                      background: "rgba(0,10,20,0.65)",
                      border: "1px solid #00f0ff33",
                      borderRadius: "8px",
                      color: "#cfffff",
                      fontSize: "0.8rem",
                      padding: "8px 10px",
                      overflow: "auto",
                      flex: "1 1 auto",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.3,
                    }}
                  >
                    {captionText.length > CAPTION_SCROLL_THRESHOLD
                      ? captionText.slice(0, CAPTION_SCROLL_THRESHOLD) + "…"
                      : captionText}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: info */}
          <div
            className="post-share-info-pane"
            style={{
              flex: "1 1 auto",
              display: "flex",
              flexDirection: "column",
              color: "#cfffff",
              minWidth: 0,
            }}
          >
            <div
              style={{
                padding: "1rem 1.2rem",
                borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
              }}
            >
              {post.display_name && (
                <div
                  style={{
                    color: "#00f0ff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginBottom: "2px",
                  }}
                >
                  {post.display_name}
                </div>
              )}
              <div style={{ fontSize: "0.7rem", color: "#7fbfcc" }}>
                {formatDate(post.created_at)}
                {post.wall_type ? ` · ${post.wall_type}` : ""}
              </div>
            </div>

            <div
              style={{
                padding: "1rem 1.2rem",
                borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
                overflowY: "auto",
                flex: "0 0 auto",
                maxHeight: "30vh",
              }}
            >
              {post.headline && (
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {post.headline}
                </div>
              )}
              {captionText && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.45,
                  }}
                >
                  {captionText}
                </div>
              )}
              {tags.length > 0 && (
                <div
                  style={{
                    marginTop: "0.6rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "rgba(0, 240, 255, 0.1)",
                        border: "1px solid rgba(0, 240, 255, 0.3)",
                      }}
                    >
                      #{t.replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.2rem",
                borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
              }}
            >
              <button
                onClick={handleLikeToggle}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: likeData.liked
                    ? "rgba(255, 60, 80, 0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: likeData.liked
                    ? "1px solid rgba(255, 60, 80, 0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "0.85rem",
                }}
              >
                <span>{likeData.liked ? "❤️" : "🤍"}</span>
                <span>{likeData.count}</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "0.85rem",
                }}
              >
                💬 <span>{comments.length}</span>
              </div>

              <button
                onClick={handleShare}
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "linear-gradient(to right, #00ff99, #00f0ff)",
                  border: "none",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                🔗 Share
              </button>
            </div>

            <div
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
                padding: "0.75rem 1.2rem",
              }}
            >
              {comments.length === 0 ? (
                <div style={{ color: "#7fbfcc", fontSize: "0.8rem", textAlign: "center", padding: "1rem" }}>
                  No comments yet.
                </div>
              ) : (
                comments.map((c, i) => (
                  <div
                    key={c.id || i}
                    style={{
                      fontSize: "0.8rem",
                      padding: "6px 10px",
                      background: "rgba(0, 240, 255, 0.06)",
                      border: "1px solid rgba(0, 240, 255, 0.15)",
                      borderRadius: "6px",
                      marginBottom: "6px",
                      color: "#cfffff",
                    }}
                  >
                    <div>💬 {c.content}</div>
                    {c.created_at && (
                      <div style={{ fontSize: "0.65rem", color: "#7fbfcc", marginTop: "2px" }}>
                        {formatDate(c.created_at)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                padding: "0.75rem 1.2rem",
                borderTop: "1px solid rgba(0, 240, 255, 0.15)",
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                placeholder="Write a comment…"
                style={{
                  flex: 1,
                  background: "#0d0d0d",
                  color: "#fff",
                  border: "1px solid #00f0ff44",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  fontSize: "0.8rem",
                }}
              />
              <button
                onClick={handleSubmitComment}
                style={{
                  padding: "8px 14px",
                  background: "linear-gradient(to right, #00ff99, #00f0ff)",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .post-share-overlay-content {
            max-height: 95vh !important;
          }
          .post-share-layout {
            flex-direction: column !important;
            overflow-y: auto;
          }
          .post-share-card-pane {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0, 240, 255, 0.15) !important;
          }
          .post-share-info-pane {
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}
