import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

function PostForm({ wallType, onMediaPreview, overlayType, closeOverlay }) {
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

  return (
    <>
      {/* ✅ Blank TCG Card Preview */}
      <div
        className="relative w-full max-w-2xl mx-auto border-2 border-cyan-400 rounded-xl shadow-lg p-4"
        style={{
          backgroundImage: backgroundImage
            ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
            : "repeating-linear-gradient(45deg, #001f2f, #000b15 12px)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "340px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#00f0ffcc",
        }}
      >
        {/* Top Row: SigIcon + Display Name */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-3xl">{sigIcon || "🤖"}</span>
          <span
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              background: "rgba(0, 255, 255, 0.2)",
              border: "1px solid #00f0ff88",
            }}
          >
            {displayName || "Blank Post Card Preview"}
          </span>
        </div>

        {/* Content Boxes */}
        <div className="flex-1 flex flex-col justify-center text-center space-y-2">
          <p className="text-lg italic text-cyan-200">Your TCG-style card will appear here</p>
          <p className="text-sm text-cyan-300">Once you post, the preview will fill with your content</p>
        </div>

        {/* Footer Row: Stats + Comments Placeholder */}
        <div className="flex justify-between items-center pt-3 border-t border-cyan-800 text-sm">
          <span>❤️ 0</span>
          <span>💬 0</span>
        </div>
      </div>
    </>
  );
}

export default PostForm;
