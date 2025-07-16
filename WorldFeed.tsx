import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed";
import ChumFeedPanel from "./src/ChumFeedPanel";
/////////////////////////////////////////////////////
// ✅ Helpers
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
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const id = match ? match[1] : "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`;
  }
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    return match ? `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1` : null;
  }
  return null;
}
/////////////////////////////////////////////////////////////
// ✅ Fetch comments
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

// ✅ Submit a comment
async function submitComment(postId, content, wallType) {
  const res = await fetch("/.netlify/functions/create-comment", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, content, wall_type: wallType }),
  });
  return res.ok;
}
////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////
  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }
/////////////////////////////////////////////////////////////////
  return (
    <div style={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
      <div style={{ width: "20%", background: "#0a0a0a", borderRight: "1px solid #222" }}>
        <ChumFeedPanel />
      </div>

      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          padding: "1rem",
          background: "#0d0d0d",
          position: "relative",
          overflowY: "scroll",
        }}
      >
        {posts.map((post) => {
          const safeTags = Array.isArray(post.tags)
            ? post.tags
            : typeof post.tags === "string"
            ? post.tags.split(",").map((tag) => tag.trim())
            : [];

          const comments = commentsMap[post.id] || [];
/////////////////////////////////////////////////////////////////////
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

        : "repeating-linear-gradient(45deg, #222, #111 10px)", // ⛔ fallback pattern
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

    {/* TCG Layout */}
    <div style={{ position: "relative", zIndex: 2 }}>
      {/* Header Line */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.5rem",
        background: "rgba(0,0,0,0.5)",
        padding: "6px 10px",
        borderRadius: "12px",
      }}>
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

        </div>


      {/* Card Title */}
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
    zIndex: 2,
    position: "relative",
  }}>
        📛 {post.headline}
      </div>

      {/* Type / Tagline */}
      <div style={{
        fontSize: "0.85rem",
        color: "#ccc",
        marginBottom: "1rem"
      }}>
        📂 Type — SIGZICON
      </div>

      {/* --- Content Media Already Here (image/video/embed) --- */}


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

              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>{post.headline}</h3>
              <p style={{ fontSize: "0.9rem", color: "white", marginBottom: "0.5rem" }}>{post.caption}</p>

              {safeTags.includes("link") && post.caption?.startsWith("http") && (
                isYouTubeOrTikTok(post.caption) && getEmbedUrl(post.caption) ? (
                  <div style={{ marginTop: "0.5rem" }}>
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
                        overflow: "hidden",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <a
                    href={post.caption}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #00f0ff44",
                      borderRadius: "12px",
                      padding: "1rem",
                      backgroundColor: "#0f0f0f",
                      marginTop: "0.5rem",
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Link preview"
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                        }}
                      />
                    )}
                    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "0.25rem" }}>
                      {post.headline || "Shared via SignalZ"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#ccc" }}>
                      {extractDomain(post.caption)}
                    </div>
                  </a>
                )
              )}

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

      
      {/* ATK / DEF Slot */}
      <div style={{
        marginTop: "1rem",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        color: "white",
        background: "rgba(0,0,0,0.3)",
        padding: "6px 10px",
        borderRadius: "10px"
      }}>
        <div>❤️ Likes: {post.likes || 0}</div>
        <div>💬 Comments: {comments.length || 0}</div>
      </div>

      {/* Z-ATK / Z-DEF Slot */}
      <div style={{
        marginTop: "0.4rem",
        fontSize: "0.85rem",
        color: "#aaa",
        background: "rgba(0,0,0,0.25)",
        padding: "4px 10px",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        👁️ Views and Shares
      </div>
    </div>

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
            //////////////////////////////////////////////////////////////////////
          );
        })}

        <div
          style={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            height: "80px",
            background: "linear-gradient(to bottom, rgba(13,13,13,0), rgba(13,13,13,1))",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            pointerEvents: "none",
          }}
        >
          <div style={{ animation: "bounce 2s infinite", fontSize: "1.5rem", color: "#00f0ff" }}>⬇</div>
        </div>
      </div>

      <div
        className="hide-scrollbar"
        style={{
          width: "22%",
          background: "#0a0a0a",
          padding: "1rem",
          borderLeft: "1px solid #222",
          color: "white",
          overflowY: "scroll",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>🗞️ News Feed</h2>

        <iframe
          width="100%"
          height="100%"
          src="https://abcnews.go.com/video/embed?id=abc_live11"
          allowFullScreen
          frameBorder="0"
          style={{
            borderRadius: "10px",
            border: "1px solid #00f0ff44",
            objectFit: "cover",
          }}
        />

        <NewsFeed />
      </div>
    </div>
  );
}
