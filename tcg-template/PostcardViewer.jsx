import React, { useEffect, useState } from "react";
import TCGCardTemplate from "./TCGCardTemplate";
 
const STORAGE_KEY = "sigz_incoming_post";
 
function mapSkoolPost(skoolPost) {
  return {
    headline:     skoolPost.title    || "Untitled",
    caption:      skoolPost.body     || "",
    image_url:    skoolPost.media    || "",
    video_url:    "",
    sigicon_url:  skoolPost.avatar   || "",
    display_name: skoolPost.author   || "Skool User",
    cta_url:      "",
    background:   "",
    wall_type:    "main",
    likes:        skoolPost.likes    || 0,
    comments:     skoolPost.comments || 0,
    badge:        skoolPost.badge    || "",
    timeText:     skoolPost.timeText || "",
    created_at:   new Date().toISOString(),
  };
}
 
export default function PostcardViewer({ onPushToWall }) {
  const [post, setPost] = useState(null);
 
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPost(JSON.parse(saved));
    } catch (e) {}
  }, []);
 
  useEffect(() => {
    function handleMessage(event) {
      if (!event.data || event.data.type !== "SKOOL_POST") return;
      const mapped = mapSkoolPost(event.data.post);
      setPost(mapped);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      } catch (e) {}
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
 
  return (
    <div style={{
      width: "100%",
      padding: "1rem",
      background: "#000",
      borderBottom: "1px solid #222",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      position: "relative",
      zIndex: 5,
    }}>
      <h2 style={{
        color: "#00f0ff",
        fontSize: "0.85rem",
        marginBottom: "0.75rem",
        textAlign: "center",
        textShadow: "0 0 4px #00f0ff66",
        letterSpacing: "1px",
      }}>
        📬 SKOOL POST VIEWER
      </h2>
 
      {post ? (
        <>
          <TCGCardTemplate {...post} />
          <button
            onClick={() => onPushToWall && onPushToWall(post)}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "12px",
              background: "linear-gradient(135deg, #00ff99, #00f0ff)",
              color: "#000",
              fontWeight: "700",
              fontSize: "0.9rem",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              letterSpacing: "0.5px",
            }}
          >
            🚀 Push to Zetsu Wall
          </button>
          <button
            onClick={() => {
              setPost(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "6px",
              background: "transparent",
              color: "#666",
              fontSize: "0.75rem",
              border: "1px solid #222",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#333",
          fontSize: "0.85rem",
          border: "1px dashed #1a1a1a",
          borderRadius: "12px",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
          <div>Waiting for a Skool post</div>
          <div style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "#222" }}>
            Share a post from the Zetsu Backpack
          </div>
        </div>
      )}
    </div>
  );
}
