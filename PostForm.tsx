import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

function PostForm({ wallType, onMediaPreview, overlayType, closeOverlay }) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);

  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

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

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const previewUrl = URL.createObjectURL(file);
      onMediaPreview?.("video", previewUrl);
    }
  };

  const uploadVideo = async () => {
    if (!video) return "";
    const filePath = `${sessionId}/${Date.now()}_${video.name}`;
    const { error } = await supabase.storage.from("videos").upload(filePath, video);
    if (error) {
      alert("Video upload failed");
      return "";
    }
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/videos/${filePath}`;
  };

  const handlePost = async () => {
    if (!headline || !caption) return alert("Headline and caption required");
    const videoUrl = await uploadVideo();
    await fetch("/.netlify/functions/create-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        caption,
        cta_url: ctaUrl,
        video_url: videoUrl,
        tags: tags.split(",").map((t) => t.trim()),
        session_id: sessionId,
        sigicon_url: sigIcon,
        display_name: displayName,
        wall_type: wallType,
        background: backgroundImage,
      }),
    });
    setHeadline(""); setCaption(""); setCtaUrl(""); setTags(""); setVideo(null);
    alert("Posted!");
  };

  return (
    <div
      className="w-full max-w-sm p-4 rounded-xl border-4 border-cyan-400 shadow-xl mx-auto text-center space-y-4"
      style={{
        backgroundImage: backgroundImage
          ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#00f0ff",
      }}
    >
      <div className="flex justify-between items-center text-xs">
        <span className="font-mono">{sessionId}</span>
        <span>{sigIcon}</span>
      </div>

      <div className="border border-cyan-400 rounded p-1 font-bold">
        {displayName || "NAME PLATE"}
      </div>

      <div
        onClick={() => videoInputRef.current.click()}
        className="border border-cyan-300 rounded-lg p-8 cursor-pointer hover:bg-cyan-900/10"
      >
        {video ? "✅ Video Selected" : "🎬 Click to Add Video"}
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={handleVideoChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="border border-cyan-500 rounded p-3 space-y-2">
        <input
          type="text"
          placeholder="Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full bg-transparent border border-cyan-600 rounded p-2 text-center text-sm"
        />
        <textarea
          placeholder="What's meaningful about it?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-transparent border border-cyan-600 rounded p-2 text-sm"
        />
      </div>

      <input
        type="text"
        placeholder="Link (optional)"
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        className="w-full bg-transparent border border-cyan-600 rounded p-2 text-sm"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full bg-transparent border border-cyan-600 rounded p-2 text-sm"
      />

      <button
        onClick={handlePost}
        className="w-full bg-cyan-400 text-black font-bold rounded-lg py-2 hover:bg-cyan-300 transition"
      >
        🚀 Post
      </button>
    </div>
  );
}

export default PostForm;
