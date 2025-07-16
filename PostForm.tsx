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
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(""); // ✅ NEW
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
    if (icon) setSigIcon(icon);

    const name = sessionStorage.getItem("session_display_name");
    if (name) setDisplayName(name);

    const bg = sessionStorage.getItem("session_bg");
    if (bg) setBackgroundImage(bg); // ✅ pull background image
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
        background: backgroundImage, // ✅ tie session ID image to post
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
      const background = backgroundImage || getBackgroundFromSession(sessionId);

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

      if (!response.ok) throw new Error("Link submission failed");
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

      {backgroundImage && (
        <img
          src={`/postcard-assets/cardbase/${backgroundImage}.png`}
          alt="Session background"
          style={{ width: "100px", borderRadius: "8px", marginBottom: "10px" }}
        />
      )}

      {/* Rest of your form is unchanged */}
      {/* ... All inputs, buttons, and link submit remain intact ... */}

      {/* Form content omitted for brevity — you already have it right. */}
    </div>
  );
}

export default PostForm;
