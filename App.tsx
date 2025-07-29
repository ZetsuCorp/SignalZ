import React, { useState, useEffect } from "react";
import WorldFeed from "./WorldFeed";
import MediaEditor from "./MediaEditor";
import SessionContainer from "./src/SessionIdDisplay/SessionContainer";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showViewOptions, setShowViewOptions] = useState(false); // ← for ▼ dropdown

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

  const handleMediaConfirm = (editedSrc) => {
    setEditorVisible(false);
    setEditorType(null);
    setEditorSrc(null);
  };

  return (
    <div className="app-wrapper">
      {/* 🔹 Session Overlay */}
      <SessionContainer />

      <main className="right-panel">
        {/* 🔹 Header Logo */}
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

        {/* 🔹 Dropdown Tabs */}
        <div className="flex justify-center gap-4 py-2 border-b border-cyan-800 bg-[#071a1e]">
          {["ViewZ", "HotFeed", "Brand-Signal", "SignalZ TCG"].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setOpenDropdown(openDropdown === tabName ? null : tabName)}
              className={`tab ${openDropdown === tabName ? "active" : ""}`}
            >
              {tabName}
            </button>
          ))}

          {/* ▼ Dropdown Menu */}
          <div className="relative">
            <button
              className="tab"
              onClick={() => setShowViewOptions(!showViewOptions)}
            >
              ▼
            </button>
            {showViewOptions && (
              <div className="absolute bg-[#081c24] text-cyan-200 shadow-lg rounded px-4 py-2 right-0 z-20">
                {["Post View", "Feed", "News"].map((item) => (
                  <div key={item} className="py-1 px-2 hover:bg-cyan-800 rounded cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Active Panel Display */}
        {openDropdown === "ViewZ" && (
          <div className="w-full bg-[#081c24] border-b border-cyan-700 text-cyan-200 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">ViewZ</h2>
            <p className="text-sm opacity-60">This will show user post metrics, engagement, reach, or analytics.</p>
          </div>
        )}
        {openDropdown === "HotFeed" && (
          <div className="w-full bg-[#081c24] border-b border-cyan-700 text-cyan-200 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">HotFeed</h2>
            <p className="text-sm opacity-60">Trending post selector or custom feed injection.</p>
          </div>
        )}
        {openDropdown === "Brand-Signal" && (
          <div className="w-full bg-[#081c24] border-b border-cyan-700 text-cyan-200 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Brand-Signal</h2>
            <p className="text-sm opacity-60">Bot-injected brand mentions, logo tools, etc.</p>
          </div>
        )}
        {openDropdown === "SignalZ TCG" && (
          <div className="w-full bg-[#081c24] border-b border-cyan-700 text-cyan-200 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">SignalZ TCG</h2>
            <p className="text-sm opacity-60">This is where we show card decks, rarity, battles, leaderboard, whatever.</p>
          </div>
        )}

        {/* 🔹 Wall Tabs */}
        <div className="tabs flex justify-center gap-2 py-4 border-b border-cyan-800">
          {["main", "alt", "zetsu"].map((id) => (
            <button
              key={id}
              onClick={() => setWallType(id)}
              className={`tab px-3 py-1 border border-transparent text-cyan-300 hover:border-cyan-500 ${
                wallType === id ? "border-b-2 border-cyan-300 text-white" : ""
              }`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🔹 Feed Content */}
        <div className="feed-scroll">
          <WorldFeed wallType={wallType} />
        </div>
      </main>

      {/* ⚙️ Settings Drawer */}
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

      {/* 🖼️ Media Editor */}
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
