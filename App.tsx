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
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", overlayVisible);
  }, [overlayVisible]);

  const handleMediaPreview = (type, src) => {
    setOverlayType(type);
    setOverlaySrc(src);
    setOverlayVisible(true);
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <aside className="left-panel">
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

          <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>

          <div className="monetize-panel">
            <h3>Monetize</h3>
            <a className="monetize-link" href="/monetize">
              Open Monetization
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="right-panel">
        <header className="text-center pb-4">
          <h1 className="text-2xl m-0">🌐 SIGNALZ</h1>
          <p className="text-sm text-gray-600">What the internet is talking about.</p>
        </header>

        <div className="tabs mb-4 flex gap-2">
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
      </main>

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
