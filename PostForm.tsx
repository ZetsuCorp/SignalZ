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

  const uploadImage = async () => {
    if (!image) return "";
    const path = `${sessionId}/${Date.now()}_${image.name}`;
    const { error } = await supabase.storage.from("images").upload(path, image);
    if (error) {
      alert("Image upload failed");
      return "";
    }
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
  };

  const uploadVideo = async () => {
    if (!video) return "";
    const path = `${sessionId}/${Date.now()}_${video.name}`;
    const { error } = await supabase.storage.from("videos").upload(path, video);
    if (error) {
      alert("Video upload failed");
      return "";
    }
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/videos/${path}`;
  };

  const handlePost = async () => {
    if (!headline || !caption) return alert("Headline and caption required");
    const imageUrl = await uploadImage();
    const videoUrl = await uploadVideo();

    await fetch("/.netlify/functions/create-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        caption,
        cta_url: ctaUrl,
        image_url: imageUrl,
        video_url: videoUrl,
        tags: tags.split(",").map(t => t.trim()),
        session_id: sessionId,
        sigicon_url: sigIcon,
        display_name: displayName,
        wall_type: wallType,
        background: backgroundImage,
      }),
    });

    setHeadline(""); setCaption(""); setCtaUrl(""); setTags("");
    setImage(null); setVideo(null);
    alert("Posted!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      onMediaPreview?.("image", URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      onMediaPreview?.("video", URL.createObjectURL(file));
    }
  };

  return (
    <>
      {/* === TCG Blank Template === */}
      <div
        className="tcg-card relative w-full max-w-xl mx-auto border-4 border-cyan-500 rounded-xl overflow-hidden shadow-md mb-6"
        style={{
          backgroundImage: backgroundImage
            ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
            : "repeating-linear-gradient(45deg, #001820, #000a1a 20px)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "2rem",
          color: "#00f0ff",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-2xl drop-shadow">{sigIcon}</span>
          <span className="bg-cyan-900 text-sm px-3 py-1 rounded-full border border-cyan-300">
            {displayName || "Anonymous"}
          </span>
        </div>
        <div className="text-center text-xl font-bold italic py-6 opacity-60">
          Blank Post Card Preview
        </div>
        <div className="h-20 bg-cyan-800 bg-opacity-10 rounded-md mb-3"></div>
        <div className="h-6 bg-cyan-800 bg-opacity-10 rounded mb-2"></div>
        <div className="h-6 bg-cyan-800 bg-opacity-10 rounded mb-4 w-2/3 mx-auto"></div>
        <div className="flex justify-between text-sm text-cyan-400">
          <span>❤️ 0</span>
          <span>💬 0</span>
        </div>
        <div className="pt-4 text-cyan-600 text-xs italic text-center">
          Comment area will appear once posted
        </div>
      </div>

      {/* === Post Form === */}
      <div className="max-w-2xl w-full mx-auto p-4 rounded-xl border border-cyan-600 text-center space-y-4">
        <input type="text" placeholder="Brand Name / Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full" style={tcgInputStyle} />
        <textarea placeholder="What's meaningful about it?" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full resize-none" style={{ ...tcgInputStyle, height: "6rem" }} />
        <input type="text" placeholder="Link (optional)" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="w-full" style={tcgInputStyle} />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full" style={tcgInputStyle} />

        <button onClick={() => imageInputRef.current.click()} className="bg-cyan-900 hover:bg-cyan-800 text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400">🖼 Add Image</button>
        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{ display: "none" }} />

        <button onClick={() => videoInputRef.current.click()} className="bg-cyan-900 hover:bg-cyan-800 text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400">🎬 Add Video</button>
        <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} style={{ display: "none" }} />

        <button onClick={handlePost} className="bg-[#00ff99] hover:bg-[#00ffaa] text-black font-bold px-4 py-2 rounded w-full shadow-md">🚀 Post to {wallType.toUpperCase()} Wall</button>
      </div>
    </>
  );
}

export default PostForm;
