// PostcardViewer.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/client";
import { getBackgroundFromSession } from "../src/utils/getBackgroundFromSession";
import TCGCardTemplate from "./TCGCardTemplate";

export default function PostcardViewer() {
  const [sessionId, setSessionId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("session_id");
    const name = sessionStorage.getItem("session_display_name");
    const bg = sessionStorage.getItem("session_bg");

    if (!id || !name || !bg) {
      const newId = uuidv4();
      const newName = "Anonymous";
      const newBg = getBackgroundFromSession(newId);

      sessionStorage.setItem("session_id", newId);
      sessionStorage.setItem("session_display_name", newName);
      sessionStorage.setItem("session_bg", newBg);

      setSessionId(newId);
      setDisplayName(newName);
      setBgImage(`/postcard-assets/cardbase/${newBg}.png`);
    } else {
      setSessionId(id);
      setDisplayName(name);
      setBgImage(`/postcard-assets/cardbase/${bg}.png`);
    }
  }, []);

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

          {/* 🪪 Session ID Display Nameplate */}
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
            <strong>{displayName}</strong> — <span style={{ opacity: 0.65 }}>{sessionId}</span>
          </div>

          <TCGCardTemplate />
        </div>
      </div>
    </div>
  );
}
