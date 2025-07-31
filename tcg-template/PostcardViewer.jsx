import React, { useEffect, useState } from "react";
import TCGCardTemplate from "./TCGCardTemplate";
import EmptyCard from "./EmptyCard";

export default function PostcardViewer() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [sessionDisplayName, setSessionDisplayName] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("session_id");
    const bg = sessionStorage.getItem("session_bg");
    const name = sessionStorage.getItem("session_display_name");

    setSessionId(id || "");
    setSessionDisplayName(name || "");
    setBgImage(`/postcard-assets/cardbase/${bg || "test0"}.png`);

    window.refreshPostcardViewer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const encodedId = encodeURIComponent(id);
        const res = await fetch(`/.netlify/functions/get-posts?session_id=${encodedId}`);
        if (!res.ok) throw new Error("Fetch failed");
        const posts = await res.json();
        const latest = posts?.[0] || null;
        setPost(latest);
        if (latest?.id) {
          fetchStats(latest.id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  const fetchStats = async (postId) => {
    try {
      const res = await fetch(`/.netlify/functions/get-comments?post_id=${postId}`);
      const comments = res.ok ? await res.json() : [];
      setCommentCount(comments.length || 0);
    } catch (err) {
      console.warn("Error loading comments:", err);
    }

    try {
      const res = await fetch(`/.netlify/functions/get-views?post_id=${postId}`);
      const data = res.ok ? await res.json() : { count: 0 };
      setViewCount(data.count || 0);
    } catch (err) {
      console.warn("Error loading views:", err);
    }
  };

  const getBarWidth = (value, max = 100) => {
    const width = Math.min((value / max) * 100, 100);
    return `${width}%`;
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        background: "#000",
        borderBottom: "1px solid #222",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        position: "relative",
        zIndex: 5,
        overflowY: "auto",
        maxHeight: "100vh",
        minHeight: "600px",
      }}
    >
      <div
        style={{
          border: "8px solid cyan",
          borderRadius: "20px",
          padding: "8px",
          backgroundColor: "#111",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "#00f0ff",
              fontSize: "1rem",
              marginBottom: "0.5rem",
              textAlign: "center",
              textShadow: "0 0 4px #00f0ff66",
            }}
          >
            🧵 Session Postcard Preview
          </h2>

          {loading ? (
            <div style={{ color: "#888", textAlign: "center" }}>Loading...</div>
          ) : post ? (
            <>
              <TCGCardTemplate {...post} display_name={sessionDisplayName} />
              <div
                style={{
                  marginTop: "1.25rem",
                  background: "rgba(0, 0, 20, 0.6)",
                  border: "2px solid #00f0ff44",
                  borderRadius: "14px",
                  padding: "1rem",
                  boxShadow: "0 0 12px rgba(0, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  color: "#00f0ff",
                  fontFamily: "monospace",
                }}
              >
                <h3 style={{ fontSize: "0.95rem", marginBottom: "1rem", textAlign: "center" }}>
                  📊 Post Statistics
                </h3>

                <div style={{ marginBottom: "0.75rem" }}>
                  👁️ Views: {viewCount}
                  <div style={{ height: "8px", borderRadius: "6px", background: "#002233", overflow: "hidden", marginTop: "4px" }}>
                    <div style={{ width: getBarWidth(viewCount), height: "100%", background: "linear-gradient(90deg, #00f0ff, #0044ff)", transition: "width 0.5s ease-out" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  💬 Comments: {commentCount}
                  <div style={{ height: "8px", borderRadius: "6px", background: "#002233", overflow: "hidden", marginTop: "4px" }}>
                    <div style={{ width: getBarWidth(commentCount), height: "100%", background: "linear-gradient(90deg, #00ffcc, #0099cc)", transition: "width 0.5s ease-out" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  ❤️ Likes: {post.likes || 0}
                  <div style={{ height: "8px", borderRadius: "6px", background: "#002233", overflow: "hidden", marginTop: "4px" }}>
                    <div style={{ width: getBarWidth(post.likes || 0), height: "100%", background: "linear-gradient(90deg, #ff00cc, #ff6600)", transition: "width 0.5s ease-out" }} />
                  </div>
                </div>

                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
                  ⚡ Engagement Score: <strong>72%</strong>
                </div>
              </div>
            </>
          ) : (
            <EmptyCard />
          )}
        </div>
      </div>
    </div>
  );
}
