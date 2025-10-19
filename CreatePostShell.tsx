// ✅ Full Zetsu-Card Styled CreatePostShell (TCG modal style)
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

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
    width: "100%"
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
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-80 flex items-center justify-center p-0 m-0">
      <div className="frameType max-w-[460px] w-full aspect-[3/4] overflow-hidden rounded-xl shadow-xl relative">
        <div
          className="frameType-inner text-center p-4 space-y-4 h-full overflow-y-auto"
          style={{
            backgroundImage: backgroundImage
              ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="card-header">
            <div className="card-id">{displayName || "SignalZ User"}</div>
            <div className="card-name"><span>{headline || "Untitled Post"}</span></div>
            <div className="card-icon">{sigIcon ? "🌐" : "⚡"}</div>
          </div>

          <div className="card-art h-[160px] overflow-hidden rounded">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover" />
            ) : video ? (
              <video className="w-full h-full object-cover" controls>
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <div className="text-cyan-300 pt-12">🖼 No media added</div>
            )}
          </div>

          <div className="type-banner">
            <div className="type-cell">{modeLabel}</div>
            <div className="type-about-wrap">
              <div className="type-about-box">
                <span className="type-about-text">{wallType.toUpperCase()} Wall</span>
              </div>
            </div>
            <div className="type-cell">✨</div>
          </div>

          <div className="effect-box">
            <div className="effect-entry">
              <div className="effect-text">{caption || "Write something meaningful..."}</div>
            </div>
            {ctaUrl && (
              <a href={ctaUrl} target="_blank" rel="noreferrer" className="source-pill mt-1 inline-block">Visit Link</a>
            )}
          </div>

          <div className="meta-block">
            <div className="meta-line"><div className="meta-label">Tags -</div><div className="meta-value">{tags || "None"}</div></div>
            <div className="meta-line"><div className="meta-label">Wall -</div><div className="meta-value">{wallType}</div></div>
          </div>

          <div className="meta-bottom">
            <div className="meta-footer-text">SignalZ | Zetsumetsu Corp</div>
            <div className="meta-timestamp">{new Date().toLocaleString()}</div>
            <div className="rarity SR">LIVE</div>
          </div>

          <input type="text" placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} style={tcgInputStyle} />
          <textarea placeholder="What's meaningful about it?" value={caption} onChange={(e) => setCaption(e.target.value)} style={{ ...tcgInputStyle, height: "5rem" }} />
          <input type="text" placeholder="Link (optional)" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} style={tcgInputStyle} />
          <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} style={tcgInputStyle} />

          <button onClick={() => imageInputRef.current.click()} className="bg-cyan-900 hover:bg-cyan-700 text-white px-4 py-2 rounded w-full">🖼 Add Image</button>
          <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{ display: "none" }} />

          <button onClick={() => videoInputRef.current.click()} className="bg-cyan-900 hover:bg-cyan-700 text-white px-4 py-2 rounded w-full">🎬 Add Video</button>
          <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoChange} style={{ display: "none" }} />

          <button onClick={handlePost} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded w-full">🚀 Post</button>

          <div className="meta-block mt-3">
            <div className="meta-line">
              <div className="meta-label">🌐 Social Link</div>
            </div>
            <input type="text" placeholder="Paste any video or social link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} style={tcgInputStyle} />
            <button onClick={handleSubmitLink} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded w-full border border-blue-400">🔗 Submit Link</button>
          </div>

          <button onClick={onClose} className="absolute top-3 right-3 text-cyan-300 hover:text-white text-lg">✖</button>
        </div>
      </div>
    </div>
  );
}
