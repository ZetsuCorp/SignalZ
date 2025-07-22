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

  const handleSubmitLink = async () => {
    if (!linkInput.trim()) return alert("Please enter a link");
    try {
      const domain = new URL(linkInput).hostname.replace("www.", "");
      const background = backgroundImage || getBackgroundFromSession(sessionId);
      const res = await fetch("/.netlify/functions/create-link-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: linkInput,
          session_id: sessionId,
          sigicon_url: sigIcon,
          wall_type: wallType,
          tags: ["link"],
          link_title: "Shared via SignalZ",
          cta_link_url: domain,
          background,
        }),
      });
      if (!res.ok) throw new Error("Link submission failed");
      setLinkInput("");
      alert("Link submitted to SignalZ!");
    } catch (err) {
      console.error("Link error:", err);
      alert("Invalid link or submission error");
    }
  };

  return (
    <>
      {/* === TCG Preview Card === */}
      <div
        className="relative w-full rounded-xl border border-cyan-500 shadow-inner p-4 mb-4"
        style={{
          backgroundImage: backgroundImage
            ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
            : "linear-gradient(135deg, #001f2f, #000b15)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "240px",
        }}
      >
        {sigIcon && (
          <div style={{
            position: "absolute", top: "8px", left: "8px",
            fontSize: "1.5rem", filter: "drop-shadow(0 0 4px #00f0ff88)"
          }}>{sigIcon}</div>
        )}
        {displayName && (
          <div style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(0,255,255,0.2)", border: "1px solid #00f0ff88",
            borderRadius: "999px", padding: "4px 10px",
            fontWeight: "bold", color: "#00f0ff", fontSize: "0.9rem"
          }}>{displayName}</div>
        )}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", color: "#00f0ff99",
          textAlign: "center", fontStyle: "italic", paddingTop: "2rem"
        }}>
          <p style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>📝 Post Preview</p>
          <p style={{ fontSize: "0.9rem" }}>Your card will appear here once posted</p>
        </div>
      </div>

      {/* === Post Form Overlay === */}
      <div
        className="w-full max-w-2xl rounded-xl border border-cyan-600 shadow-lg p-6 space-y-4 relative text-center"
        style={{
          backgroundImage: backgroundImage
            ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "blur(4px)",
          color: "#00f0ff",
        }}
      >
        <button
          onClick={closeOverlay}
          className="absolute top-3 right-3 text-cyan-300 hover:text-white text-lg"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold text-cyan-300">
          {overlayType === "image" && "🖼 Create Image Post"}
          {overlayType === "video" && "🎬 Create Video Post"}
          {overlayType === "social" && "🌐 Share Social Link"}
        </h2>

        <input type="text" placeholder="Brand Name / Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full" style={tcgInputStyle} />
        <textarea placeholder="What's meaningful about it?" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full resize-none" style={{ ...tcgInputStyle, height: "6rem" }} />
        <input type="text" placeholder="Link (optional)" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="w-full" style={tcgInputStyle} />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full" style={tcgInputStyle} />

        <button onClick={() => imageInputRef.current.click()} className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400">🖼 Add Image</button>
        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{ display: "none" }} />

        <button onClick={() => videoInputRef.current.click()} className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400">🎬 Add Video</button>
        <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} style={{ display: "none" }} />

        <button onClick={handlePost} className="bg-[#00ff99] hover:bg-[#00ffaa] text-black font-bold px-4 py-2 rounded w-full shadow-md">🚀 Post to {wallType.toUpperCase()} Wall</button>

        <div className="space-y-2">
          <h3 className="text-cyan-300 font-semibold">🌐 Submit a Social Link to SignalZ</h3>
          <input type="text" placeholder="Paste any video or social link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} className="w-full" style={tcgInputStyle} />
          <button onClick={handleSubmitLink} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded w-full border border-blue-400">🔗 Submit Link</button>
        </div>
      </div>
    </>
  );
}

export default PostForm;
