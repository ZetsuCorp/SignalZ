import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";

export default function App() {
  const [wallType, setWallType] = useState("main");

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Left: Navy Blue Full-Height Post Panel */}
      <div className="left-panel">
        <h2>Start a Post</h2>
        <PostForm wallType={wallType} />
      </div>

      {/* Right: Feed Area */}
      <div className="right-panel">
        {/* Header (now inside right panel to match split layout) */}
        <header style={{ textAlign: "center", paddingBottom: "1rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>🌐 SIGNALZ</h1>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            What the internet is talking about.
          </p>
        </header>

        <div className="tabs" style={{ marginBottom: "1rem" }}>
          {["main", "alt", "zetsu"].map((id) => (
            <button
              key={id}
              onClick={() => setWallType(id)}
              className={`tab ${wallType === id ? "active" : ""}`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>

        <WorldFeed wallType={wallType} />
      </div>
    </div>
  );
}
