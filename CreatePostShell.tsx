
// Zetsu-Card Styled CreatePostShell
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";

import "./CreatePostShell.css";

const WALL_LABELS = {
  main: "⚡ Zetsu",
  hobbies: "🎨 Hobbies",
  music: "🎸 Music",
  money: "💰 Money",
  spirituality: "🙏 Spirituality",
  tech: "💻 Tech",
  health: "🥕 Health",
  sports: "⚽ Sports",
  "self-improvement": "📚 Self-improvement",
  relationships: "❤️ Relationships",
};

const CATEGORY_OPTIONS = [
  { id: "hobbies", label: "🎨 Hobbies" },
  { id: "music", label: "🎸 Music" },
  { id: "money", label: "💰 Money" },
  { id: "spirituality", label: "🙏 Spirituality" },
  { id: "tech", label: "💻 Tech" },
  { id: "health", label: "🥕 Health" },
  { id: "sports", label: "⚽ Sports" },
  { id: "self-improvement", label: "📚 Self-improvement" },
  { id: "relationships", label: "❤️ Relationships" },
];


export default function CreatePostShell({ mode, onClose, wallType = "main", onMediaPreview, onPostCreated }) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(wallType === "main" ? "" : wallType);

  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  const [showMediaOptions, setShowMediaOptions] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setVideo(null);
      setShowMediaOptions(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setImage(null);
      setShowMediaOptions(false);
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
    if (!selectedCategory) return alert("Please select a category for your post");
    const imageUrl = await uploadImage();
    const videoUrl = await uploadVideo();
    try {
      const res = await fetch("/.netlify/functions/create-posts", {
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
          wall_type: selectedCategory,
          background: backgroundImage,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert("Failed to create post: " + (errData.error || res.statusText));
        return;
      }
    } catch (err) {
      alert("Network error — post was not created.");
      return;
    }
    setHeadline(""); setCaption(""); setCtaUrl(""); setTags("");
    setImage(null); setVideo(null);
    if (onPostCreated) {
      onPostCreated();
    } else {
      alert("Posted!");
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

  const imagePreviewUrl = image ? URL.createObjectURL(image) : null;

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
          {/* Title + Nameplate */}
          <div className="card-title">📝 Create New Post</div>
          <div className="nameplate-row">
            <div className="label">Name Plate</div>
            <div className="value">{displayName || "SignalZ User"}</div>
          </div>

          {/* Header Bar (Headline Input) */}
          <div className="card-header">
            <input
              type="text"
              placeholder="Title of Post"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          {/* Artwork Area */}
          <div
            className="card-art card-art-clickable"
            onClick={() => { if (!image && !video) setShowMediaOptions(!showMediaOptions); }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="preview"
              />
            ) : video ? (
              <video controls onClick={(e) => e.stopPropagation()}>
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <div className="placeholder">
                🖼 Tap to add Image or Video
              </div>
            )}

            {/* Change media button when image/video already set */}
            {(image || video) && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowMediaOptions(true); }}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  background: "rgba(0,0,0,0.7)",
                  color: "#00f0ff",
                  border: "1px solid #00f0ff66",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  zIndex: 3,
                }}
              >
                Change
              </button>
            )}

            {showMediaOptions && (
              <div className="card-art-options" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { imageInputRef.current.click(); setShowMediaOptions(false); }}>
                  🖼 Image
                </button>
                <button type="button" onClick={() => { videoInputRef.current.click(); setShowMediaOptions(false); }}>
                  🎬 Video
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Type Banner / Category Selector */}
          <div className="type-banner">
            <div className="type-cell">{modeLabel}</div>
            <div className="type-about-wrap">
              <div className="type-about-box">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    background: "rgba(0, 10, 20, 0.65)",
                    border: "1px solid #00f0ff44",
                    borderRadius: "8px",
                    color: "#e0fefe",
                    padding: "6px 12px",
                    fontSize: "13px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <option value="" disabled>Select Category...</option>
                  {CATEGORY_OPTIONS.map(({ id, label }) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="type-cell">✨</div>
          </div>

          {/* Effect Box (Caption + Link merged) */}
          <div className="effect-box">
            <textarea
              placeholder="Write something meaningful OR paste any video or social link..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Meta Section (Tags + Social Link) */}
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
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Row */}
          <div className="submit-row">
            <button onClick={handlePost}>
              🚀 Post to {WALL_LABELS[selectedCategory] || "Select Category"} Wall
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

{/* Close button pinned to bottom-right */}
<button
  onClick={onClose}
  className="absolute bottom-4 right-4 text-cyan-300 hover:text-white text-3xl font-bold z-[1000001]"
>
  ✖
</button>
</div>
);
}
