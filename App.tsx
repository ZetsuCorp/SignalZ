import React, { useState, useEffect } from "react";
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

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

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
      {/* Session ID Floating Overlay */}
      <SessionContainer />

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

        {/* Wall Selector Tabs */}
        <div className="tabs flex justify-center gap-2 py-4 border-b border-cyan-800">
          {["main", "alt", "zetsu"].map((id) => (
            <button
              key={id}
              onClick={() => setWallType(id)}
              className={`tab px-4 py-2 rounded border border-cyan-700 text-cyan-300 transition hover:bg-cyan-900 ${
                wallType === id ? "bg-cyan-800 text-white" : ""
              }`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="feed-scroll">
          <WorldFeed wallType={wallType} />
        </div>

        {/* Dropdown Tabs */}
        <div className="flex justify-center gap-6 py-4 border-b border-cyan-800 relative z-10">
          {["about", "sources", "tools"].map((id) => (
            <div key={id} className="relative">
              <button
                onClick={() => toggleDropdown(id)}
                className={`px-4 py-2 rounded border border-cyan-700 text-cyan-300 transition duration-200 hover:bg-cyan-900 ${
                  activeDropdown === id ? "bg-cyan-800 text-white" : ""
                }`}
              >
                {id.toUpperCase()}
              </button>

              {activeDropdown === id && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#101820] border border-cyan-700 shadow-xl p-4 rounded z-50 text-center">
                  <h3 className="text-cyan-200 text-lg font-semibold mb-2">{id.toUpperCase()}</h3>
                  <p className="text-cyan-400 text-sm">
                    This is the content for <strong>{id}</strong>. Add your info here.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Settings Drawer */}
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

      {/* Media Overlay Editor */}
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
