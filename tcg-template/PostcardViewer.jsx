import React from "react";
import TCGCardTemplate from "./tcg-template";

export default function PostcardViewer() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <TCGCardTemplate
          headline="Test Headline"
          caption="This is a test caption for preview."
          image_url=""
          video_url=""
          sigicon_url=""
          display_name="TestUser"
          created_at="2025-07-31"
          background="test0"
          cta_url=""
          likes={0}
          comments={[]}
        />
      </div>
    </div>
  );
}
