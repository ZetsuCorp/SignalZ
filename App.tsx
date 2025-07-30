import React, { useState, useEffect } from "react";
import WorldFeed from "./WorldFeed";
import MediaEditor from "./MediaEditor";
import SessionContainer from "./src/SessionIdDisplay/SessionContainer";

export default function App() {
  const [wallType, setWallType] = useState("main");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleMediaConfirm = () => {
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

   {/* 🔹 Centered Dropdown Tab Row */}
<div className="w-full flex justify-center items-center gap-6 py-4 border-b border-cyan-800 bg-[#071a1e]">
  {["ViewZ", "HotFeed", "Brand-Signal", "SignalZ TCG"].map((tabName) => (
    <button
      key={tabName}
      onClick={() => setOpenDropdown(openDropdown === tabName ? null : tabName)}
      className={`px-4 py-2 text-cyan-300 font-medium hover:text-white transition-all duration-150 ${
        openDropdown === tabName ? "border-b-2 border-cyan-300 text-white" : ""
      }`}
    >
      {tabName}
    </button>
  ))}
</div>


{/* 🔹 Dedicated Panel Per Dropdown */}
{openDropdown && (
  <div className="w-full bg-[#081c24] border-b border-cyan-700 text-cyan-200 p-6 text-center">
    {openDropdown === "ViewZ" && (
      <>
        <h2 className="text-xl font-bold mb-2">ViewZ</h2>
        <p className="text-sm opacity-60">This will show user post metrics, engagement, reach, or analytics.</p>
      </>
    )}

    {openDropdown === "HotFeed" && (
      <>
        <h2 className="text-xl font-bold mb-2">HotFeed</h2>
        <p className="text-sm opacity-60">Trending post selector or custom feed injection.</p>
      </>
    )}

    {openDropdown === "Brand-Signal" && (
      <>
        <h2 className="text-xl font-bold mb-2">Brand-Signal</h2>
        <p className="text-sm opacity-60">Bot-injected brand mentions, logo tools, etc.</p>
      </>
    )}

    {openDropdown === "SignalZ TCG" && (
      <>
        <h2 className="text-xl font-bold mb-2">SignalZ TCG</h2>
        <p className="text-sm opacity-60">Card decks, rarity, battles, leaderboard, etc.</p>
      </>
    )}
  </div>
)}

{/* 🔹 Centered Wall Type Tabs */}
<div className="w-full flex justify-center items-center gap-6 py-4 border-b border-cyan-800">
  {["main", "alt", "zetsu"].map((id) => (
    <button
      key={id}
      onClick={() => setWallType(id)}
      className={`px-4 py-2 text-cyan-300 font-semibold uppercase hover:text-white transition-all duration-150 ${
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
