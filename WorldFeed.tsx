import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed";

// Fetch comments
async function fetchComments(postId) {
  try {
    const res = await fetch(`/.netlify/functions/get-comments?post_id=${postId}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
}

// Submit a comment
async function submitComment(postId, content, wallType) {
  const res = await fetch("/.netlify/functions/create-comment", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, content, wall_type: wallType }),
  });
  return res.ok;
}

export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [commentsMap, setCommentsMap] = useState({});
  const [inputMap, setInputMap] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const safeWall = (wallType || "main").toLowerCase();
        const res = await fetch(`/.netlify/functions/get-posts?wall_type=${safeWall}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      }
    };
    fetchPosts();
  }, [wallType]);

  useEffect(() => {
    posts.forEach(async (post) => {
      const comments = await fetchComments(post.id);
      setCommentsMap((prev) => ({ ...prev, [post.id]: comments }));
    });
  }, [posts]);

  const handleCommentSubmit = async (postId) => {
    const content = inputMap[postId];
    if (!content || !content.trim()) return;

    const ok = await submitComment(postId, content, wallType);
    if (ok) {
      const updated = await fetchComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: updated }));
      setInputMap((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  // ✅ Generate Chum Button Function
  const generateChum = async () => {
    try {
      const res = await fetch("/.netlify/functions/generate-chum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "a llama running a haunted amusement park",
          funnel_type: "quiz"
        })
      });
      const data = await res.json();
      alert(data.message || data.error || "No response");
      console.log("Chum Generation Result:", data);
    } catch (err) {
      console.error("Generate chum failed:", err);
      alert("Failed to generate chum.");
    }
  };

  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }

  return (
    <div style={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
      {/* Left Panel */}
      <div style={{ width: "20%", background: "#0a0a0a", padding: "1rem", borderRight: "1px solid #222", color: "white" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>🪣 Chum Bucket</h2>

        {/* ✅ Added Generate Chum Button */}
        <button
          onClick={generateChum}
          style={{
            backgroundColor: "#00AEEF",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginBottom: "1rem"
          }}
        >
          Generate Chum
        </button>

        <p>Coming soon...</p>
      </div>

      {/* Center Feed */}
      {/* (no changes made to the center or right panels) */}
      {/* ... Keep your original code here unchanged ... */}

      {/* Right Panel */}
      <div
        className="hide-scrollbar"
        style={{
          width: "22%",
          background: "#0a0a0a",
          padding: "1rem",
          borderLeft: "1px solid #222",
          color: "white",
          overflowY: "scroll",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>🗞️ News Feed</h2>

        <iframe
          width="100%"
          height="100%"
          src="https://abcnews.go.com/video/embed?id=abc_live11"
          allowFullScreen
          frameBorder="0"
          style={{
            borderRadius: "10px",
            border: "1px solid #00f0ff44",
            objectFit: "cover",
          }}
        />

        <NewsFeed />
      </div>
    </div>
  );
}
