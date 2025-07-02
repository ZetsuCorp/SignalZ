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
      <header style={{ textAlign: "center", padding: "1rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>🌐 SIGNALZ</h1>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          What the internet is talking about.
        </p>
      </header>

      <div className="container">
        {/* Left Panel */}
        <div className="left-panel">
          <PostForm wallType={wallType} />
        </div>

        {/* Right Panel */}
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

