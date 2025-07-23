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
  const [sessionDisplayName, setSessionDisplayName] = useState("");

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

  const sessionBg = sessionStorage.getItem("session_bg") || "test0";
  const sessionIcon = sessionStorage.getItem("session_icon") || "/sigicons/ripple.gif";

  return (
    <div className="app-wrapper">
      {/* 🔹 Session Floating ID */}
      <SessionContainer onNameGenerated={setSessionDisplayName} />

      {/* 🔹 Left Panel as Card */}
      <aside className="left-panel">
        <div
          className="tcg-post-card relative w-full rounded-2xl border border-cyan-600 shadow-lg text-center overflow-hidden"
          style={{
            backgroundImage: `url(/postcard-assets/cardbase/${sessionBg}.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "1.5rem",
            color: "#00f0ff",
          }}
        >
          {/* 🔹 Icon */}
          <div className="absolute top-2 left-2 z-10">
            <img src={sessionIcon} alt="sigicon" className="w-10 h-10" />
          </div>

          {/* 🔹 Name */}
          <div className="border border-cyan-400 rounded px-3 py-1 text-sm font-bold mb-4 inline-block">
            {sessionDisplayName || "Loading..."}
          </div>

          {/* 🔹 Form */}
          <div className="bg-[#000000aa] rounded-lg p-3 shadow-inner backdrop-blur-sm border border-cyan-800">
            <PostForm wallType={wallType} onMediaPreview={handleMediaPreview} />
          </div>

          {/* 🔹 Sidebar Footer */}
          <div className="mt-6 text-xs text-cyan-400 italic">
            Viewer Mode — Preview your card post in real-time
          </div>

          <div className="mt-4 text-center space-y-2">
            <h3 className="text-sm font-semibold">Signal Source</h3>
            <div className="source-pill mb-2">{wallType.toUpperCase()}</div>
            <p className="text-xs text-cyan-300">
              Posts go to the selected wall.
            </p>

            <button
              className="mt-4 text-sm text-cyan-200 hover:underline"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
            </button>

            <a href="/monetize" className="monetize-link mt-2 block">
              💸 Open Monetization
            </a>

            <a
              href="/jessica"
              className="mt-2 block text-sm text-cyan-300 hover:underline"
            >
              🧠 Run Jessica AI
            </a>
          </div>
        </div>
      </aside>

      {/* 🔹 Main Panel */}
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

      {/* 🔹 Media Editor */}
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
