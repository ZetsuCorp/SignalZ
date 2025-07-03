import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  return (
    <div className="app-wrapper">
      {/* Left Panel */}
      <div className="left-panel">
        <h2>Start a Post</h2>
        <PostForm wallType={wallType} />

        <div className="signal-source">
          <h3>Signal Source</h3>
          <div className="source-pill">{wallType.toUpperCase()}</div>
          <p className="source-desc">
            This tag determines which feed the post appears in. Choose between
            <strong> MAIN</strong>, <strong> ALT</strong>, or <strong> ZETSU</strong>.
          </p>
        </div>

        {/* Settings Button */}
        <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>

        {/* Monetize Button */}
        <div className="monetize-panel">
          <h3>Monetize</h3>
          <a className="monetize-link" href="/monetize">
            Open Monetization
          </a>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <header style={{ textAlign: "center", paddingBottom: "1rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>🌐 SIGNALZ</h1>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            What the internet is talking about.
          </p>
        </header>

        {/* Tabs */}
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

        {/* Feed */}
        <WorldFeed wallType={wallType} />
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="settings-drawer">
          <h3>Settings</h3>
          <div className="toggle-row">
            <input type="checkbox" id="darkmode" />
            <label htmlFor="darkmode">Dark Mode (coming soon)</label>
          </div>
          <button onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
