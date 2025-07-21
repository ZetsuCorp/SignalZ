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

  const [showOverlay, setShowOverlay] = useState(false);
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

  const handleMediaConfirm = (editedSrc) => {
    setEditorVisible(false);
    setEditorType(null);
    setEditorSrc(null);
  };

  const openOverlay = (type) => {
    setOverlayType(type);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayType(null);
  };

  return (
    <div className="app-wrapper">
      <SessionContainer />

      <aside className="left-panel">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Create</h2>
          <div className="relative inline-block text-left z-30 mb-4">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded shadow"
            >
              📢 Create
            </button>
            {showOverlay && (
              <div className="absolute right-0 mt-2 w-60 bg-[#101820] border border-cyan-500 rounded shadow-xl">
                <button onClick={() => openOverlay("image")} className="block w-full text-left px-4 py-2 text-cyan-300 hover:bg-cyan-900">🖼 Create Image Post</button>
                <button onClick={() => openOverlay("video")} className="block w-full text-left px-4 py-2 text-cyan-300 hover:bg-cyan-900">🎬 Create Video Post</button>
                <button onClick={() => openOverlay("social")} className="block w-full text-left px-4 py-2 text-cyan-300 hover:bg-cyan-900">🌐 Share Social Link</button>
              </div>
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Signal Source</h3>
            <div className="source-pill mb-2">{wallType.toUpperCase()}</div>
            <p className="text-xs text-cyan-300">Posts go to the selected wall.</p>
          </div>
          <button
            className="mt-4 text-sm text-cyan-200 hover:underline"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
          <a href="/monetize" className="monetize-link mt-4 block">💸 Open Monetization</a>
          <a href="/jessica" className="mt-2 block text-sm text-cyan-300 hover:underline">🧠 Run Jessica AI</a>
        </div>
      </aside>

      <main className="right-panel">
        <header className="text-center py-4 border-b border-cyan-800 relative">
          <div className="sigz-icon-stack relative inline-block w-14 h-14">
            <span className="emoji-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-4xl">🌐</span>
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
          <button className="mt-4" onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}

      {editorVisible && editorSrc && (
        <MediaEditor
          type={editorType}
          src={editorSrc}
          onClose={() => setEditorVisible(false)}
          onConfirm={handleMediaConfirm}
        />
      )}

      {showOverlay && overlayType && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-md flex justify-center items-center p-6"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-3xl h-full rounded-xl overflow-auto p-4 border border-cyan-500 bg-[#0a0a0a] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-cyan-400 text-xl hover:text-white"
              onClick={closeOverlay}
            >
              ✖
            </button>
            <PostForm
              wallType={wallType}
              onMediaPreview={handleMediaPreview}
              overlayType={overlayType}
              closeOverlay={closeOverlay}
            />
          </div>
        </div>
      )}
    </div>
  );
}
