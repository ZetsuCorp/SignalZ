// PostForm.tsx
import React from "react"; // ✅ This line is essential
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";

function PostForm({ wallType }) {
  const [headline, setHeadline] = useState("");
  const [caption, setCaption] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sessionId, setSessionId] = useState("");

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

  const uploadImage = async () => {
    if (!image) return "";
    const filePath = `${sessionId}/${Date.now()}_${image.name}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, image);

    if (error) {
      alert("Image upload failed");
      return "";
    }

    const { data: publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return publicUrl?.publicUrl || "";
  };

  const handlePost = async () => {
    if (!headline || !caption) return alert("Headline and caption required");

    const imageUrl = await uploadImage();

    await fetch("/api/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        caption,
        cta_url: ctaUrl,
        image_url: imageUrl,
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
    alert("Posted!");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow max-w-xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="Brand Name / Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="What's meaningful about it?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-2 rounded h-24"
      />
      <input
        type="text"
        placeholder="Link (optional)"
        value={ctaUrl}
        onChange={(e) => setCtaUrl(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full"
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="preview"
          className="w-full h-auto mt-2 rounded"
        />
      )}
      <button
        onClick={handlePost}
        className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
      >
        Post
      </button>
    </div>
  );
}

export default PostForm;
