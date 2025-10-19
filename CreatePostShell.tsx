// ✅ Zetsu-Card Accurate CreatePostShell (fixed sizing + layout)
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

export default function CreatePostShell({
  mode,
  onClose,
  wallType = "main",
  onMediaPreview,
}) {
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
    padding: "10px 14px",
    width: "100%",
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
    if (error) return alert("Image upload failed"), "";
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
  };

  const uploadVideo = async () => {
    if (!video) return "";
    const path = `${sessionId}/${Date.now()}_${video.name}`;
    const { error } = await supabase.storage.from("videos").upload(path, video);
    if (error) return alert("Video upload failed"), "";
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
        tags: tags.split(",").map((t) => t.trim()),
        session_id: sessionId,
        sigicon_url: sigIcon,
        display_name: displayName,
        wall_type: wallType,
        background: backgroundImage,
      }),
    });
    setHeadline(""); setCaption(""); setCtaUrl(""); setTags(""); setImage(null); setVideo(null);
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
      alert("Link submitted!");
    } catch (err) {
      console.error(err);
      alert("Invalid or failed submission");
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
    <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4">
      <div className="frameType relative w-[clamp(360px,92vw,460px)]">
        <div
          className="frameType-inner text-center flex flex-col"
          style={{
            backgroundImage: backgroundImage
              ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* === HEADER === */}
          <div className="card-header">
            <div className="card-id">{displayName || "SignalZ User"}</div>
            <div className="card-name"><span>{headline || "Untitled Post"}</span></div>
            <div className="card-icon">{sigIcon || "⚡"}</div>
          </div>

          {/* === ARTWORK === */}
          <div className="card-art" style={{ aspectRatio: "4 / 3", overflow: "hidden" }}>
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            ) : video ? (
              <video controls style={{ width:"100%",height:"100%",objectFit:"cover" }}>
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <div style={{ color:"#999",padding:"40px 0" }}>🖼 No media added</div>
            )}
          </div>

          {/* === TYPE BANNER === */}
          <div className="type-banner">
            <div className="type-cell">{modeLabel}</div>
            <div className="type-about-wrap">
              <div className="type-about-box">
                <span className="type-about-text">{wallType.toUpperCase()} Wall</span>
              </div>
            </div>
            <div className="type-cell">✨</div>
          </div>

          {/* === CAPTION / EFFECT === */}
          <div className="effect-box">
            <div className="effect-entry">
              <div className="effect-text">{caption || "Write something meaningful..."}</div>
            </div>
            {ctaUrl && (
              <a href={ctaUrl} target="_blank" rel="noreferrer" className="source-pill inline-block mt-2">
                Visit Link
              </a>
            )}
          </div>

          {/* === META === */}
          <div className="meta-block">
            <div className="meta-line"><div className="meta-label">Tags -</div><div className="meta-value">{tags || "None"}</div></div>
            <div className="meta-line"><div className="meta-label">Wall -</div><div className="meta-value">{wallType}</div></div>
          </div>

          {/* === BOTTOM === */}
          <div className="meta-bottom">
            <div className="meta-footer-text">SignalZ | Zetsumetsu Corp</div>
            <div className="meta-timestamp">{new Date().toLocaleString()}</div>
            <div className="rarity SR">LIVE</div>
          </div>

          {/* === INPUTS / ACTIONS === */}
          <div className="p-3 flex flex-col gap-2">
            <input type="text" placeholder="Headline" value={headline} onChange={(e)=>setHeadline(e.target.value)} style={tcgInputStyle}/>
            <textarea placeholder="What's meaningful about it?" value={caption} onChange={(e)=>setCaption(e.target.value)} style={{...tcgInputStyle,height:"4.5rem"}}/>
            <input type="text" placeholder="Link (optional)" value={ctaUrl} onChange={(e)=>setCtaUrl(e.target.value)} style={tcgInputStyle}/>
            <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e)=>setTags(e.target.value)} style={tcgInputStyle}/>
            <button onClick={()=>imageInputRef.current.click()} className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 border border-cyan-400 rounded py-2">🖼 Add Image</button>
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{display:"none"}}/>
            <button onClick={()=>videoInputRef.current.click()} className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 border border-cyan-400 rounded py-2">🎬 Add Video</button>
            <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} style={{display:"none"}}/>
            <button onClick={handlePost} className="submit w-full mt-2 border border-cyan-400 rounded py-2">🚀 Post</button>
          </div>

          {/* === SOCIAL LINK === */}
          <div className="meta-block mt-2">
            <div className="meta-line"><div className="meta-label">🌐 Social Link</div></div>
            <input type="text" placeholder="Paste any video or social link" value={linkInput} onChange={(e)=>setLinkInput(e.target.value)} style={tcgInputStyle}/>
            <button onClick={handleSubmitLink} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded w-full border border-blue-400 mt-2">🔗 Submit Link</button>
          </div>

          {/* === CLOSE === */}
          <button onClick={onClose} className="absolute top-3 right-3 text-cyan-300 hover:text-white text-lg">✖</button>
        </div>
      </div>
    </div>
  );
}
