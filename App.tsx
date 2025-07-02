import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Left: Navy Blue Full-Height Post Panel */}
      <div className="left-panel">
        <h2>Start a Post</h2>
        <PostForm wallType={wallType} />

        {/* 🔵 Signal Source Block */}
        <div className="signal-source">
          <h3>Signal Source</h3>
          <div className="source-pill">{wallType.toUpperCase()}</div>
          <p className="source-desc">
            This tag determines which feed the post appears in. Choose between
            <strong> MAIN</strong>, <strong> ALT</strong>, or <strong> ZETSU</strong>.
          </p>
        </div>

        {/* ⚙️ Settings */}
        <div className="settings-panel">
          <h3>⚙️ Settings</h3>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span>Dark Mode</span>
          </label>
        </div>

        {/* 💰 Monetize (coming next) */}
        {/* <div className="monetize-panel">
          <h3>💰 Monetize</h3>
          <a href="/zetsu-router" className="monetize-link">Go to BrandImage Creator</a>
        </div> */}
      </div>

      {/* Right: Feed Area */}
      <div className="right-panel">
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
