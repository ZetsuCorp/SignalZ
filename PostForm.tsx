import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

export default function PostForm({ wallType = "main", onMediaPreview, overlayType, closeOverlay }) {
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

  const uploadMedia = async () => {
    if (image) {
      const path = `${sessionId}/${Date.now()}_${image.name}`;
      const { error } = await supabase.storage.from("images").upload(path, image);
      if (error) return "";
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
    }
    if (video) {
      const path = `${sessionId}/${Date.now()}_${video.name}`;
      const { error } = await supabase.storage.from("videos").upload(path, video);
      if (error) return "";
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/videos/${path}`;
    }
    return "";
  };

  const handlePost = async () => {
    if (!headline || !caption) return alert("Headline and caption required");
    const mediaUrl = await uploadMedia();
    await fetch("/.netlify/functions/create-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        caption,
        cta_url: ctaUrl,
        image_url: image && mediaUrl,
        video_url: video && mediaUrl,
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

  const tcgInputStyle = "bg-[#00101a99] text-cyan-100 border border-cyan-600 px-3 py-2 rounded text-sm w-full text-center backdrop-blur";

  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-80 flex items-center justify-center p-6">
      <div className="frameType aspect-[3/4] max-w-[460px] w-full overflow-hidden">
        <div
          className="frameType-inner text-center p-4 flex flex-col justify-between h-full"
          style={{
            backgroundImage: backgroundImage ? `url(/postcard-assets/cardbase/${backgroundImage}.png)` : undefined,
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
            <div className="type-cell">📝 Create Post</div>
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

          <div className="flex flex-col gap-2">
            <input type="text" placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className={tcgInputStyle} />
            <textarea placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className={tcgInputStyle + " h-[4rem]"} />
            <input type="text" placeholder="Link (optional)" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className={tcgInputStyle} />
            <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className={tcgInputStyle} />
            <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current.click()} className="bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded w-full">🖼 Add Image or Video</button>
            <button onClick={handlePost} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded w-full">🚀 Post</button>
            <button onClick={closeOverlay} className="text-cyan-300 hover:text-white text-sm mt-1">✖ Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
