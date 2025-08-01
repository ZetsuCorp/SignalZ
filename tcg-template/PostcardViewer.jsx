// PostcardViewer.jsx

import React from "react";
import TCGCardTemplate from "./TCGCardTemplate";

export default function PostcardViewer() {
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
            background: "#000",
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

          {/* ✅ Just the template for now */}
          <TCGCardTemplate />
        </div>
      </div>
    </div>
  );
}
