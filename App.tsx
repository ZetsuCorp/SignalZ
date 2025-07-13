import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import MediaEditor from "./MediaEditor";
import SessionContainer from "./src/SessionIdDisplay/SessionContainer";


export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorType, setEditorType] = useState(null);
  const [editorSrc, setEditorSrc] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", editorVisible);
  }, [editorVisible]);

  const handleMediaPreview = (type, src) => {
    setEditorType(type);
    setEditorSrc(src);
    setEditorVisible(true);
  };

  const handleMediaConfirm = (editedSrc: string) => {
    setEditorVisible(false);
    setEditorType(null);
    setEditorSrc(null);
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <aside className="left-panel">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Create</h2>
          <PostForm wallType={wallType} onMediaPreview={handleMediaPreview} />
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Signal Source</h3>
            <div className="source-pill mb-2">{wallType.toUpperCase()}</div>
            <p className="text-xs text-cyan-300">
              Posts go to the selected wall.
            </p>
          </div>
          <button
            className="mt-4 text-sm text-cyan-200 hover:underline"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
          <a href="/monetize" className="monetize-link mt-4 block">
            💸 Open Monetization
          </a>
        </div>
      </aside>

      {/* Feed */}
      <main className="right-panel">
        <header className="text-center py-4 border-b border-cyan-800">
          <h1 className="text-3xl font-bold text-cyan-200">🌐 SIGNALZ</h1>
          <p className="text-sm text-cyan-400">What the internet is talking about.</p>
        </header>

        <div className="tabs flex justify-center gap-2 py-4 border-b border-cyan-800">
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

        <div className="feed-scroll">
          <WorldFeed wallType={wallType} />
        </div>
      </main>

      {/* Settings */}
      {showSettings && (
        <div className="settings-drawer">
          <h3>Settings</h3>
          <div className="toggle-row mt-3">
            <input
              type="checkbox"
              id="darkmode"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
            />
            <label htmlFor="darkmode">Dark Mode</label>
          </div>
          <button className="mt-4" onClick={() => setShowSettings(false)}>
            Close
          </button>
        </div>
      )}

      {/* Media Overlay */}
      {editorVisible && editorSrc && (
        <MediaEditor
          type={editorType}
          src={editorSrc}
          onClose={() => setEditorVisible(false)}
          onConfirm={handleMediaConfirm}
        />
      )}
    </div>
  );
}
