import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";

export default function App() {
  const [wallType, setWallType] = useState("main");

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  return (
    <div>
      {/* Header */}
      <header style={{ textAlign: "center", padding: "1rem 0" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>🌐 SIGNALZ</h1>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          What the internet is talking about.
        </p>
      </header>

      {/* Layout Container */}
      <div className="container">
        {/* Left: Navy Blue Panel with PostForm */}
        <div className="left-panel">
          <h2>Start a Post</h2>
          <PostForm wallType={wallType} />
        </div>

        {/* Right: Feed + Tabs */}
        <div className="right-panel">
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
    </div>
  );
}
