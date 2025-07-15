import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

function PostForm({ wallType, onMediaPreview }) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState(""); // ✅ NEW
  const [linkInput, setLinkInput] = useState("");

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    let existing = localStorage.getItem("session_id");
    if (!existing) {
      existing = uuidv4();
      localStorage.setItem("session_id", existing);
    }
    setSessionId(existing);

    const icon = sessionStorage.getItem("session_icon");
    if (icon) {
      setSigIcon(icon);
    }

    const name = sessionStorage.getItem("session_display_name"); // ✅ NEW
    if (name) {
      setDisplayName(name);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      if (onMediaPreview) onMediaPreview("image", previewUrl);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const previewUrl = URL.createObjectURL(file);
      if (onMediaPreview) onMediaPreview("video", previewUrl);
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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
  };

  const uploadVideo = async () => {
    if (!video) return "";
    const filePath = `${sessionId}/${Date.now()}_${video.name}`;
    const { error } = await supabase.storage.from("videos").upload(filePath, video);
    if (error) {
      alert("Video upload failed");
      return "";
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/videos/${filePath}`;
  };

  const handlePost = async () => {
    if (!headline || !caption) {
      alert("Headline and caption required");
      return;
    }

    const imageUrl = await uploadImage();
    const videoUrl = await uploadVideo();
    const background = getBackgroundFromSession(sessionId);

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
        display_name: displayName, // ✅ Added here
        wall_type: wallType,
        background,
      }),
    });

    setHeadline("");
    setCaption("");
    setCtaUrl("");
    setTags("");
    setImage(null);
    setVideo(null);
    alert("Posted!");
  };

  const handleSubmitLink = async () => {
    if (!linkInput.trim()) {
      alert("Please enter a link");
      return;
    }

    try {
      const domain = new URL(linkInput).hostname.replace("www.", "");
      const background = getBackgroundFromSession(sessionId);

      const response = await fetch("/.netlify/functions/create-link-post", {
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

      if (!response.ok) {
        throw new Error("Link submission failed");
      }

      setLinkInput("");
      alert("Link submitted to SignalZ!");
    } catch (err) {
      console.error("Submit link error:", err);
      alert("Invalid link or submission error");
    }
  };

  return (
    <div className="bg-[#0c0c0c] text-cyan-200 p-5 rounded-2xl shadow-lg border border-cyan-400 space-y-4">
      <h2 className="text-lg font-bold text-cyan-300">📢 Create a New Drop</h2>

      <select
        value={wallType}
        onChange={() => {}}
        disabled
        className="w-full bg-[#111] text-cyan-200 border border-cyan-500 p-2 rounded focus:outline-none"
      >
        <option value="main">Main Wall</option>
        <option value="alt">Alt Wall</option>
        <option value="zetsu">Z-Wall</option>
      </select>

      <input
        type="text"
        placeholder="Brand Name / Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        className="w-full bg-[#111] text-white border border-cyan-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />

      <textarea
        placeholder="What's meaningful about it?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full bg-[#111] text-white border border-cyan-500 p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />

      <input
        type="text"
        placeholder="Link (optional)"
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        className="w-full bg-[#111] text-white border border-cyan-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full bg-[#111] text-white border border-cyan-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />

      <button
        type="button"
        onClick={() => imageInputRef.current.click()}
        className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 font-medium px-4 py-2 rounded w-full border border-cyan-400"
      >
        🖼 Add Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={() => videoInputRef.current.click()}
        className="bg-[#00f0ff22] hover:bg-[#00f0ff44] text-cyan-100 font-medium px-4 py-2 rounded w-full border border-cyan-400"
      >
        🎬 Add Video
      </button>
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoChange}
        style={{ display: "none" }}
      />

      <button
        onClick={handlePost}
        className="bg-[#00ff99] hover:bg-[#00ffaa] text-black font-bold px-4 py-2 rounded w-full shadow-md hover:shadow-lg transition"
      >
        🚀 Post to {wallType.toUpperCase()} Wall
      </button>

      <div className="mt-6 space-y-2">
        <h3 className="text-cyan-300 font-semibold">🌐 Submit a Social Link to SignalZ</h3>
        <input
          type="text"
          placeholder="Paste any video or social link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="w-full bg-[#111] text-white border border-cyan-500 p-2 rounded focus:outline-none"
        />
        <button
          onClick={handleSubmitLink}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded w-full border border-blue-400"
        >
          🔗 Submit Link
        </button>
      </div>
    </div>
  );
}

export default PostForm;
