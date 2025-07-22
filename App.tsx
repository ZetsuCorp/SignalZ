import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import MediaEditor from "./MediaEditor";
import SessionContainer from "./src/SessionIdDisplay/SessionContainer";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorType, setEditorType] = useState(null);
  const [editorSrc, setEditorSrc] = useState(null);
  const [overlayType, setOverlayType] = useState(null);

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
      {/* 🔹 Session ID Floating Overlay */}
      <SessionContainer />

      {/* 🔹 Toggle Button to Show Sidebar */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-50 bg-cyan-800 text-white px-3 py-1 rounded shadow-md"
        >
          → Show Panel
        </button>
      )}

      {/* 🔹 Sidebar Panel (Retractable) */}
      {showSidebar && (
        <aside className="left-panel">
          <div className="sidebar-content">
            <h2 className="sidebar-title">Create</h2>
            <PostForm
              wallType={wallType}
              onMediaPreview={handleMediaPreview}
              overlayType={null}
              closeOverlay={() => {}}
            />
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

            <a
              href="/jessica"
              className="mt-2 block text-sm text-cyan-300 hover:underline"
            >
              🧠 Run Jessica AI
            </a>

            <button
              onClick={() => setShowSidebar(false)}
              className="mt-4 text-xs text-cyan-500 underline"
            >
              ← Hide Panel
            </button>
          </div>
        </aside>
      )}

      {/* 🔹 Main Feed Area */}
      <main className="right-panel">
        <header className="text-center py-4 border-b border-cyan-800 relative">
          <div className="sigz-icon-stack relative inline-block w-14 h-14">
            <span className="emoji-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-4xl">
              🌐
            </span>
            <img
              src="/sigicons/ripple.gif"
              alt="Ripple"
              className="ripple-overlay absolute top-1/2 left-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            />
          </div>
          <h1 className="text-3xl font-bold text-cyan-200 mt-2">SIGNALZ</h1>
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

      {/* 🔹 Settings Drawer */}
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

      {/* 🔹 Media Overlay Editor */}
      {editorVisible && editorSrc && (
        <MediaEditor
          type={editorType}
          src={editorSrc}
          onClose={() => setEditorVisible(false)}
          onConfirm={handleMediaConfirm}
        />
      )}

      {/* 🔹 PostForm Fullscreen Overlay (from Create Button) */}
      {overlayType && (
        <div className="postform-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex justify-center items-center">
          <PostForm
            wallType={wallType}
            overlayType={overlayType}
            closeOverlay={() => setOverlayType(null)}
            onMediaPreview={handleMediaPreview}
          />
        </div>
      )}
    </div>
  );
}
