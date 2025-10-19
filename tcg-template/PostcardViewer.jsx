import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/client";
import { getBackgroundFromSession } from "../src/utils/getBackgroundFromSession";
import TCGCardTemplate from "./TCGCardTemplate";

export default function PostcardViewer() {
  const [sessionId, setSessionId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("session_id");
    const name = sessionStorage.getItem("session_display_name");
    const bg = sessionStorage.getItem("session_bg");

    let activeId = id;
    let activeName = name;
    let activeBg = bg;

    // If any values missing, generate new session
    if (!id || !name || !bg) {
      activeId = uuidv4();
      activeName = "Anonymous";
      activeBg = getBackgroundFromSession(activeId);

      sessionStorage.setItem("session_id", activeId);
      sessionStorage.setItem("session_display_name", activeName);
      sessionStorage.setItem("session_bg", activeBg);
    }

    setSessionId(activeId);
    setDisplayName(activeName);
    setBgImage(`/postcard-assets/cardbase/${activeBg}.png`);

    // Initial fetch
    fetch(`/.netlify/functions/get-posts?session_id=${activeId}`)
      .then((res) => res.json())
      .then((posts) => {
        if (Array.isArray(posts) && posts.length > 0) {
          setPost(posts[0]);
        }
      })
      .catch((err) => {
        console.warn("Error fetching posts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔁 Auto-refresh: poll every 4 seconds
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      fetch(`/.netlify/functions/get-posts?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((posts) => {
          if (Array.isArray(posts) && posts.length > 0) {
            const latest = posts[0];
            if (!post || latest.id !== post.id) {
              setPost(latest);
            }
          }
        })
        .catch((err) => {
          console.warn("Auto-refresh fetch failed:", err);
        });
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionId, post]);

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

          {/* 🪪 Display Nameplate */}
          <div
            style={{
              margin: "0 auto 1rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "#00f0ff",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              border: "1px solid #00f0ff44",
              textAlign: "center",
              maxWidth: "480px",
              textShadow: "0 0 6px #00f0ff55",
            }}
          >
            <strong>{displayName}</strong>
          </div>

          {/* 🖼️ Post Display */}
          {loading ? (
            <div style={{ color: "#888", textAlign: "center" }}>Loading...</div>
          ) : post ? (
            <TCGCardTemplate {...post} />
          ) : (
            <div style={{ color: "#888", textAlign: "center" }}>
              No post found for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
