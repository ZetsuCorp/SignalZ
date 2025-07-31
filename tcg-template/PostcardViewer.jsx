// File: tcg-template/PostcardViewer.jsx
import React, { useEffect, useState } from "react";
import TCGCardTemplate from "./TCGCardTemplate";
import SessionContainer from "./SessionContainer";

export default function PostcardViewer() {
  const [sessionId, setSessionId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [background, setBackground] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("session_id") || "";
    const name = sessionStorage.getItem("session_display_name") || "";
    const bg = sessionStorage.getItem("session_bg") || "test0";

    setSessionId(id);
    setDisplayName(name);
    setBackground(bg);
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "2rem" }}>
      {/* 🔹 Shows sigicon and session name */}
      <SessionContainer />

      {/* 🔸 Card Preview */}
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto 0 auto",
          padding: "1rem",
        }}
      >
        <TCGCardTemplate
          headline="Test Headline"
          caption="This is a test post from your session."
          image_url=""
          video_url=""
          sigicon_url={`/sigicons/${sessionId.split("/")[1]?.split("#")[0]}`}
          display_name={displayName}
          created_at={new Date().toISOString()}
          background={background}
          cta_url=""
          likes={7}
          comments={[]}
        />
      </div>
    </div>
  );
}
