
// ✅ Full Zetsu-Card Styled CreatePostShell
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";
import "./CreatePostShell.css";


export default function CreatePostShell({ mode, onClose, wallType = "main", onMediaPreview }) {
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
      const previewUrl = URL.createObjectURL(file);
      onMediaPreview?.("image", previewUrl);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const previewUrl = URL.createObjectURL(file);
      onMediaPreview?.("video", previewUrl);
    }
  };

  const uploadImage = async () => {
    if (!image) return "";
    const filePath = `${sessionId}/${Date.now()}_${image.name}`;
    const { error } = await supabase.storage.from("images").upload(filePath, image);
    if (error) {
      alert("Image upload failed");
      return "";
    }
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;
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
        tags: tags.split(",").map((t) => t.trim()),
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
          link_image: null,
          image_url: null,
          video_url: null,
          cta_link_url: domain,
          background,
        }),
      });
      if (!res.ok) throw new Error("Link submission failed");
      setLinkInput("");
      alert("Link submitted to SignalZ!");
    } catch (err) {
      console.error("Submit link error:", err);
      alert("Invalid link or submission error");
    }
  };

  const modeLabel =
    mode === "image"
      ? "🖼 Create Image Post"
      : mode === "video"
      ? "🎬 Create Video Post"
      : mode === "link"
      ? "🌐 Share Social Link"
      : "📝 Create New Post";

  return (
    <div className="fixed inset-0">
      <div className="frameType">
        <div
          className="frameType-inner"
          style={{
            backgroundImage: backgroundImage
              ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 📝 Title + Nameplate */}
          <div className="card-title">📝 Create New Post</div>
          <div className="nameplate-row">
            <div className="label">Name Plate</div>
            <div className="value">{displayName || "SignalZ User"}</div>
          </div>

          {/* 🔹 Header Bar (Headline Input) */}
          <div className="card-header">
            <input
              type="text"
              placeholder="Title of Post"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          {/* 🔸 Stat Row (Placeholder) */}
          <div className="stat-row">N/A</div>

          {/* 🖼 Artwork Area */}
          <div className="card-art">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" />
            ) : video ? (
              <video controls>
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <div className="placeholder">
                🖼 No media added — Click below to add
              </div>
            )}
          </div>

          {/* Upload Buttons inside art section */}
          <div className="submit-row">
            <button type="button" onClick={() => imageInputRef.current.click()}>
              🖼 Add Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button type="button" onClick={() => videoInputRef.current.click()}>
              🎬 Add Video
            </button>
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />
          </div>

          {/* 🔷 Type Banner / Wall Selector */}
          <div className="type-banner">
            <div className="type-cell">{modeLabel}</div>
            <div className="type-about-wrap">
              <div className="type-about-box">
                <span className="type-about-text">
                  {wallType.toUpperCase()} Wall
                </span>
              </div>
            </div>
            <div className="type-cell">✨</div>
          </div>

          {/* 🧠 Effect Box (Caption + Link merged) */}
          <div className="effect-box">
            <textarea
              placeholder="Write something meaningful OR paste any video or social link..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* 📘 Meta Section (Tags + Social Link) */}
          <div className="meta-block">
            <div className="meta-row">
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <input
                type="text"
                placeholder="Social Link"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
            </div>
          </div>

          {/* 🔗 Submit Row */}
          <div className="submit-row">
            <button onClick={handleSubmitLink}>🔗 Submit Link</button>
            <button onClick={handlePost}>
              🚀 Post to {wallType.toUpperCase()} Wall
            </button>
          </div>

          {/* FOOTER */}
          <div className="meta-bottom">
            <div className="meta-footer-text">SignalZ | Zetsumetsu Corp</div>
            <div className="meta-timestamp">
              {new Date().toLocaleString()}
            </div>
            <div className="rarity SR">LIVE</div>
          </div>
        </div>
      </div>

      {/* ✅ Close button pinned to bottom-right */}
      <button
        onClick={onClose}
        className="absolute bottom-4 right-4 text-cyan-300 hover:text-white text-3xl font-bold z-[1000001]"
      >
        ✖
      </button>
    </div>
  );
}
