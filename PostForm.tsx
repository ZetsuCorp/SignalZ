import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";

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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
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

    // Reset form
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

      {/* Add Image Button */}
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="w-full bg-gray-100 text-blue-700 font-medium py-2 px-4 rounded hover:bg-blue-50 border border-blue-200 transition"
      >
        🖼️ Add Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="preview"
          className="w-full h-auto mt-2 rounded border"
        />
      )}

      {/* Add Video Button */}
      <button
        type="button"
        onClick={() => videoInputRef.current?.click()}
        className="w-full bg-gray-100 text-blue-700 font-medium py-2 px-4 rounded hover:bg-blue-50 border border-blue-200 transition"
      >
        🎬 Add Video
      </button>
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoChange}
        className="hidden"
      />

      {videoPreview && (
        <video
          src={videoPreview}
          controls
          className="w-full h-auto mt-2 rounded border"
        />
      )}

      <button
        onClick={handlePost}
        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded w-full transition"
      >
        Post to {wallType.toUpperCase()} Wall
      </button>
    </div>
  );
}

export default PostForm;
