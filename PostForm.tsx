import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function PostForm() {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    let existing = localStorage.getItem("session_id");
    if (!existing) {
      existing = uuidv4();
      localStorage.setItem("session_id", existing);
    }
    setSessionId(existing);
    setSigIcon(sessionStorage.getItem("session_icon") || "");
    setDisplayName(sessionStorage.getItem("session_display_name") || "");
    setBackgroundImage(sessionStorage.getItem("session_bg") || "");
  }, []);

  const tcgInputStyle = {
    background: "rgba(0, 10, 20, 0.65)",
    border: "1px solid #00f0ff44",
    borderRadius: "10px",
    color: "#e0fefe",
    boxShadow: "inset 0 0 10px rgba(0, 255, 255, 0.1)",
    backdropFilter: "blur(6px)",
    padding: "12px 16px",
    lineHeight: "1.4",
    textAlign: "center",
  };

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
      <div className="text-cyan-300 text-sm font-mono tracking-wide">{sessionId}</div>
      <div className="text-2xl font-bold">{sigIcon} {displayName}</div>

      <input
        type="text"
        placeholder="Post Title"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        style={tcgInputStyle}
        className="w-full"
      />
      <textarea
        placeholder="What do you want to say?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ ...tcgInputStyle, height: "6rem" }}
        className="w-full resize-none"
      />
      <input
        type="text"
        placeholder="Optional Link"
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        style={tcgInputStyle}
        className="w-full"
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={tcgInputStyle}
        className="w-full"
      />

      <div className="text-sm text-cyan-400 italic pt-4">This is a static post preview. No uploads or backend actions.</div>
    </div>
  );
}

export default PostForm;
