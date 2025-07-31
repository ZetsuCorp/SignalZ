import React from "react";
import TCGCardTemplate from "./tcg-template/TCGCardTemplate";

export default function PostViewer() {
  const displayName = sessionStorage.getItem("session_display_name") || "";
  const sigicon = sessionStorage.getItem("session_icon") || "";
  const background = sessionStorage.getItem("session_bg") || "";

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ background: "#010a0f", padding: "2rem" }}
    >
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <TCGCardTemplate
          headline=""
          caption=""
          image_url=""
          video_url=""
          sigicon_url={sigicon}
          display_name={displayName}
          created_at=""
          background={background}
          cta_url=""
          likes={0}
          comments={[]}
        />
      </div>
    </div>
  );
}
