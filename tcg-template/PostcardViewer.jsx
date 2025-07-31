import React, { useEffect, useState } from "react";
import TCGCardTemplate from "../tcg-template/TCGCardTemplate";
import EmptyCard from "../tcg-template/EmptyCard";
import SessionContainer from "./SessionIdDisplay/SessionContainer";

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

  const sigiconUrl = sessionId.includes("#")
    ? `/sigicons/${sessionId.split("/")[1]?.split("#")[0]}`
    : "";

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 🔹 Session Info Display */}
      <SessionContainer />

      {/* 🔸 Postcard Preview */}
      <div style={{ width: "100%", maxWidth: "600px", marginTop: "2rem" }}>
        {sessionId ? (
          <TCGCardTemplate
            headline="Test Headline"
            caption="This is a test post from your session."
            image_url=""
            video_url=""
            sigicon_url={sigiconUrl}
            display_name={displayName}
            created_at={new Date().toISOString()}
            background={background}
            cta_url=""
            likes={7}
            comments={[]}
          />
        ) : (
          <EmptyCard />
        )}
      </div>
    </div>
  );
}
