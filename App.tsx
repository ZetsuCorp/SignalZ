import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import MediaOverlay from "./MediaOverlay";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayType, setOverlayType] = useState(null);
  const [overlaySrc, setOverlaySrc] = useState(null);

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleMediaPreview = (type, src) => {
    setOverlayType(type);
    setOverlaySrc(src);
    setOverlayVisible(true);
  };

  return (
    <div className="app-wrapper">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="left-panel-scroll">
          <h2>Start a Post</h2>
          <PostForm wallType={wallType} onMediaPreview={handleMediaPreview} />

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
          {[
            "main",
            "alt",
            "zetsu"
          ].map((id) => (
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
            <input
              type="checkbox"
              id="darkmode"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
            />
            <label htmlFor="darkmode">Dark Mode</label>
          </div>
          <button onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}

      {/* Media Overlay */}
      {overlayVisible && overlaySrc && (
        <MediaOverlay
          type={overlayType}
          src={overlaySrc}
          onClose={() => setOverlayVisible(false)}
        />
      )}
    </div>
  );
}
