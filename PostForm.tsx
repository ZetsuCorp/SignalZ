import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase/client";
import MediaOverlay from "./MediaOverlay";
import { v4 as uuidv4 } from "uuid";

function PostForm() {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [wallType, setWallType] = useState("main");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    let existing = localStorage.getItem("session_id");
    if (!existing) {
      existing = uuidv4();
      localStorage.setItem("session_id", existing);
    }
    setSessionId(existing);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setOverlayType("image");
      setShowOverlay(true);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setOverlayType("video");
      setShowOverlay(true);
    }
  };

  const uploadMedia = async (media, bucket) => {
    if (!media) return "";
    const filePath = `${sessionId}/${Date.now()}_${media.name}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, media);
    if (error) {
      alert(`${bucket} upload failed`);
      return "";
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
  };

  const handlePost = async () => {
    if (!headline || !caption) {
      alert("Headline and caption required");
      return;
    }

    const imageUrl = await uploadMedia(image, "images");
    const videoUrl = await uploadMedia(video, "videos");

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
        wall_type: wallType,
      }),
    });

    setHeadline("");
    setCaption("");
    setCtaUrl("");
    setTags("");
    setImage(null);
    setImagePreview(null);
    setVideo(null);
    setVideoPreview(null);
    alert("Posted!");
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xl border border-blue-200 space-y-4">
      <h2 className="text-lg font-bold text-blue-800">📢 Create a New Drop</h2>

      <select
        value={wallType}
        onChange={(e) => setWallType(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <textarea
        placeholder="What's meaningful about it?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <input
        type="text"
        placeholder="Link (optional)"
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        type="button"
        onClick={() => imageInputRef.current.click()}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded w-full"
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
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded w-full"
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
        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded w-full transition"
      >
        Post to {wallType.toUpperCase()} Wall
      </button>

      {showOverlay && (imagePreview || videoPreview) && (
        <MediaOverlay
          type={overlayType}
          src={overlayType === "image" ? imagePreview : videoPreview}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}

export default PostForm;
