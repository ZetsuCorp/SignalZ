import React from "react";

export default function PostForm() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        background: "#010a0f",
        padding: "2rem",
      }}
    >
      <div
        className="tcg-card-container"
        style={{
          width: "100%",
          maxWidth: "700px",
          minHeight: "500px",
          border: "4px solid #00f0ff88",
          borderRadius: "20px",
          background: "#02151d",
          boxShadow: "0 0 20px #00f0ff55",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* TCG card will be mounted here later */}
      </div>
    </div>
  );
}
