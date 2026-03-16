
// Full Zetsu-Card Styled CreatePostShell with inline pan/zoom crop
import React, { useState, useEffect, useRef, useCallback } from "react";
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

  // Pan/zoom state for image positioning inside the art frame
  const [imgZoom, setImgZoom] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });
  const cardArtRef = useRef(null);

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

  // --- Pan handlers (mouse + touch) ---
  const handlePointerDown = useCallback((e) => {
    if (!image) return;
    e.preventDefault();
    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    offsetStart.current = { ...imgOffset };
  }, [image, imgOffset]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    const rect = cardArtRef.current?.getBoundingClientRect();
    if (!rect) return;
    setImgOffset({
      x: offsetStart.current.x + (dx / rect.width) * 100,
      y: offsetStart.current.y + (dy / rect.height) * 100,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Attach move/up listeners to window so dragging works outside the box
  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // --- Zoom handler (scroll wheel + pinch) ---
  const pinchDistRef = useRef(null);

  const handleWheel = useCallback((e) => {
    if (!image) return;
    e.preventDefault();
    setImgZoom((prev) => {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      return Math.min(4, Math.max(1, prev + delta));
    });
  }, [image]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDistRef.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && pinchDistRef.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / pinchDistRef.current;
      pinchDistRef.current = dist;
      setImgZoom((prev) => Math.min(4, Math.max(1, prev * scale)));
    }
  }, []);

  // Attach wheel + pinch listeners to card-art element
  useEffect(() => {
    const el = cardArtRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setVideo(null);
      setShowMediaOptions(false);
      // Reset pan/zoom for new image
      setImgZoom(1);
      setImgOffset({ x: 0, y: 0 });
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setImage(null);
      setShowMediaOptions(false);
      setImgZoom(1);
      setImgOffset({ x: 0, y: 0 });
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
        wall_type: "main",
        category: selectedCategory,
        background: backgroundImage,
        image_offset_x: imgOffset.x,
        image_offset_y: imgOffset.y,
        image_zoom: imgZoom,
      }),
    });
    setHeadline(""); setCaption(""); setCtaUrl(""); setTags("");
    setImage(null); setVideo(null);
    setImgZoom(1); setImgOffset({ x: 0, y: 0 });
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

          {/* Artwork Area — inline pan/zoom crop tool */}
          <div
            ref={cardArtRef}
            className="card-art card-art-clickable"
            style={{ cursor: image ? "grab" : "pointer", touchAction: "none" }}
            onClick={() => { if (!image && !video) setShowMediaOptions(!showMediaOptions); }}
            onMouseDown={handlePointerDown}
            onTouchStart={(e) => { if (e.touches.length === 1) handlePointerDown(e); }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="preview"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `translate(${imgOffset.x}%, ${imgOffset.y}%) scale(${imgZoom})`,
                  transformOrigin: "center center",
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: isDragging.current ? "none" : "transform 0.1s ease-out",
                }}
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

            {/* Zoom hint overlay when image is loaded */}
            {image && (
              <div style={{
                position: "absolute",
                bottom: "6px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.6)",
                color: "#00f0ff",
                fontSize: "0.65rem",
                padding: "2px 10px",
                borderRadius: "4px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}>
                Drag to reposition &bull; Scroll to zoom
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
