import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

export default function CreatePostShell({ mode, onClose }) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [linkInput, setLinkInput] = useState("");

  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

  const modeLabel =
    mode === "image"
      ? "📷 Image Post"
      : mode === "video"
      ? "🎬 Video Post"
      : mode === "link"
      ? "🔗 Social Link"
      : "📝 New Post";

  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-80 flex items-center justify-center p-4">
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cyan-300 hover:text-white text-lg"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold text-cyan-300">{modeLabel}</h2>

        <input
          type="text"
          placeholder="Brand Name / Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full"
          style={tcgInputStyle}
        />
        <textarea
          placeholder="What's meaningful about it?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full resize-none"
          style={{ ...tcgInputStyle, height: "6rem" }}
        />
        <input
          type="text"
          placeholder="Link (optional)"
          value={ctaUrl}
          onChange={(e) => setCtaUrl(e.target.value)}
          className="w-full"
          style={tcgInputStyle}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full"
          style={tcgInputStyle}
        />

        <button
          type="button"
          onClick={() => imageInputRef.current.click()}
          className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400"
        >
          🖼 Add Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={() => {}}
          style={{ display: "none" }}
        />

        <button
          type="button"
          onClick={() => videoInputRef.current.click()}
          className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400"
        >
          🎬 Add Video
        </button>
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={() => {}}
          style={{ display: "none" }}
        />

        <button
          className="bg-[#00ff99] text-black font-bold px-4 py-2 rounded w-full shadow-md opacity-40 cursor-not-allowed"
          disabled
        >
          🚀 Post to MAIN Wall
        </button>

        <div className="space-y-2">
          <h3 className="text-cyan-300 font-semibold">
            🌐 Submit a Social Link to SignalZ
          </h3>
          <input
            type="text"
            placeholder="Paste any video or social link"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            className="w-full"
            style={tcgInputStyle}
          />
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded w-full border border-blue-400 opacity-40 cursor-not-allowed"
            disabled
          >
            🔗 Submit Link
          </button>
        </div>
      </div>
    </div>
  );
}
