import React, { useEffect, useState } from "react";

function PostcardViewer() {
  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    setSessionId(localStorage.getItem("session_id") || "");
    setSigIcon(sessionStorage.getItem("session_icon") || "");
    setDisplayName(sessionStorage.getItem("session_display_name") || "");
    setBackgroundImage(sessionStorage.getItem("session_bg") || "");
  }, []);

  return (
    <div
      className="w-full max-w-2xl rounded-xl border border-cyan-600 shadow-lg p-6 space-y-4 relative text-center"
      style={{
        backgroundImage: backgroundImage
          ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(4px)",
        color: "#00f0ff",
      }}
    >
      {/* 🔰 Header */}
      <h2 className="text-2xl font-bold">{displayName || "Jessica AI"}</h2>
      <p className="text-cyan-200">📛 — Jessica on scene at News</p>
      <p className="text-sm text-cyan-300">📂 Type — SIGZICON</p>
      <p className="text-lg">{sigIcon || "🔰"}</p>

      {/* 🖼 Image Preview Box */}
      <div
        className="w-full h-64 border border-cyan-400 rounded-lg flex items-center justify-center bg-black bg-opacity-30 cursor-pointer hover:bg-opacity-50"
        style={{ boxShadow: "inset 0 0 10px #00f0ff44" }}
      >
        <p className="text-cyan-200">Click to add image</p>
      </div>

      {/* 📝 Description Box */}
      <div className="text-left p-4 rounded bg-black bg-opacity-30 space-y-2">
        <h3 className="font-semibold text-cyan-300">
          — Jessica on scene at News
        </h3>
        <p className="text-sm text-cyan-100 italic">
          2 days ago ... July 20, 2025 / 12:33 PM EDT / CBS News ...
        </p>
        <p className="text-xs text-cyan-400">
          Get browser notifications for breaking news, live events, and
          exclusive reporting.
        </p>
      </div>

      {/* 🕓 Timestamp + CTA */}
      <div className="flex justify-between text-sm text-cyan-400">
        <p>7/22/2025, 4:25:55 PM</p>
        <p>CTA: <span className="italic text-cyan-100">[Empty]</span></p>
      </div>

      {/* ❤️ Stats */}
      <div className="flex justify-around text-sm text-cyan-300 border-t border-cyan-700 pt-2">
        <span>❤️ Likes: 0</span>
        <span>💬 Comments: 0</span>
        <span>👁️ Views and Shares</span>
      </div>
    </div>
  );
}

export default PostcardViewer;
