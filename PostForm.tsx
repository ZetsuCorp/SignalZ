import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

function PostForm({ wallType = "main", onMediaPreview, overlayType, closeOverlay }) {
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

  const fileInputRef = useRef(null);

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
    width: "100%",
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage) {
      setImage(file);
      setVideo(null);
      onMediaPreview?.("image", URL.createObjectURL(file));
    } else if (isVideo) {
      setVideo(file);
      setImage(null);
      onMediaPreview?.("video", URL.createObjectURL(file));
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

  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="frameType w-full max-w-[460px] relative">
        <div
          className="frameType-inner text-center p-4 space-y-4"
          style={{
            backgroundImage: backgroundImage
              ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Header */}
          <div className="card-header">
            <div className="card-id">{displayName || "SignalZ User"}</div>
            <div className="card-name">
              <span>{headline || "Untitled Post"}</span>
            </div>
            <div className="card-icon">{sigIcon ? "🌐" : "⚡"}</div>
          </div>

          {/* Media */}
          <div className="card-art">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" />
            ) : video ? (
              <video controls>
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <div style={{ color: "#999", fontSize: ".9rem", paddingTop: "40px" }}>
                🖼 No media added
              </div>
            )}
          </div>

          {/* Type */}
          <div className="type-banner">
            <div className="type-cell">📝 Create Post</div>
            <div className="type-about-wrap">
              <div className="type-about-box">
                <span className="type-about-text">{wallType.toUpperCase()} Wall</span>
              </div>
            </div>
            <div className="type-cell">✨</div>
          </div>

          {/* Caption */}
          <div className="effect-box">
            <div className="effect-entry">
              <div className="effect-text">
                {caption || "Write something meaningful..."}
              </div>
            </div>
            {ctaUrl && (
              <a
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="source-pill inline-block mt-2"
              >
                Visit Link
              </a>
            )}
          </div>

          {/* Meta */}
          <div className="meta-block">
            <div className="meta-line">
              <div className="meta-label">Tags -</div>
              <div className="meta-value">{tags || "None"}</div>
            </div>
            <div className="meta-line">
              <div className="meta-label">Wall -</div>
              <div className="meta-value">{wallType}</div>
            </div>
          </div>

          {/* Inputs */}
          <input
            type="text"
            placeholder="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            style={tcgInputStyle}
          />
          <textarea
            placeholder="What's meaningful about it?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ ...tcgInputStyle, height: "5rem" }}
          />
          <input
            type="text"
            placeholder="Link (optional)"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            style={tcgInputStyle}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={tcgInputStyle}
          />

          {/* File upload */}
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 px-4 py-2 rounded w-full border border-cyan-400"
          >
            🖼 Add Image or Video
          </button>

          {/* Submit Buttons */}
          <button onClick={handlePost} className="submit w-full mt-3">
            🚀 Post to {wallType.toUpperCase()} Wall
          </button>

          {/* Link Submit */}
          <div className="meta-block mt-3">
            <div className="meta-line">
              <div className="meta-label">🌐 Social Link</div>
            </div>
            <input
              type="text"
              placeholder="Paste any video or social link"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              style={tcgInputStyle}
            />
            <button
              onClick={handleSubmitLink}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded w-full border border-blue-400"
            >
              🔗 Submit Link
            </button>
          </div>

          {/* Close */}
          <button
            onClick={closeOverlay}
            className="absolute top-3 right-3 text-cyan-300 hover:text-white text-lg"
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostForm;
