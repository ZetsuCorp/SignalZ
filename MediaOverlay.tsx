import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import MediaOverlay from "./MediaOverlay";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

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
      {/* Slide-out PostForm Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-96 bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out transform ${showPostForm ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b">
          <button onClick={() => setShowPostForm(false)}>❌ Close</button>
        </div>
        <div className="p-4 overflow-y-auto h-full">
          <PostForm wallType={wallType} onMediaPreview={handleMediaPreview} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel ml-0 sm:ml-0">
        <header style={{ textAlign: "center", paddingBottom: "1rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>🌐 SIGNALZ</h1>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            What the internet is talking about.
          </p>
        </header>

        {/* Tabs */}
        <div className="tabs mb-4 flex items-center justify-between">
          <div>
            {["main", "alt", "zetsu"].map((id) => (
              <button
                key={id}
                onClick={() => setWallType(id)}
                className={`tab mr-2 ${wallType === id ? "active" : ""}`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            ✍️ New Post
          </button>
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
