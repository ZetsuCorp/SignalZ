import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed";
import ChumFeedPanel from "./src/ChumFeedPanel";
import PostForm from "./PostForm";
import CreatePostShell from "./CreatePostShell";
import PostcardViewer from "./tcg-template/PostcardViewer";
import PostStatsView from "./src/PostStatsView";

import PanelPostView from "./components/PanelPostView";
import PanelFeed from "./components/PanelFeed";
import PanelNews from "./components/PanelNews";

// ✅ Helpers
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function isYouTubeOrTikTok(url) {
  return /youtube\.com|youtu\.be|tiktok\.com/.test(url);
}

function getEmbedUrl(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const id = match ? match[1] : "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`;
  }
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    return match ? `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1` : null;
  }
  return null;
}

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
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [createMode, setCreateMode] = useState("");
  const [activePanel, setActivePanel] = useState("middle");

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const isVisible = entry.isIntersecting;

          if (el.tagName === "VIDEO") {
            if (isVisible) el.play().catch(() => {});
            else el.pause();
          }

          if (el.tagName === "IFRAME") {
            if (el.src.includes("youtube") || el.src.includes("tiktok")) {
              if (!isVisible && el.dataset.src) {
                el.src = "";
              } else if (isVisible && el.dataset.src && el.src === "") {
                el.src = el.dataset.src;
              }
            }
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.6 }
    );

    const allMedia = document.querySelectorAll("video, iframe");
    allMedia.forEach((el) => {
      if (el.tagName === "IFRAME") el.dataset.src = el.src;
      observer.observe(el);
    });

    return () => observer.disconnect();
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

  const handleCreateClick = () => {
    setCreateMode("post");
    setShowCreateOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowCreateOverlay(false);
    setCreateMode("");
  };

  // ✅ UI
  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }

 return (
  <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
    {/* 🔹 Tab Switcher */}
    <div className="panel-tabs">
      {[
        { name: "Post View", value: "left" },
        { name: "Feed", value: "middle" },
        { name: "News", value: "right" },
      ].map(({ name, value }) => (
        <button
          key={value}
          onClick={() => setActivePanel(value)}
          className={`panel-tab ${activePanel === value ? "active" : ""}`}
        >
          {name}
        </button>
      ))}
    </div>

    {/* ✅ Floating Create Button */}
{showCreateOverlay && (
  <>
    <div className="fixed inset-0 bg-black/70 z-[999998]" onClick={handleCloseOverlay}></div>
    <div className="fixed inset-0 flex justify-center items-center z-[999999]">
      <CreatePostShell
        mode={createMode}
        onClose={handleCloseOverlay}
        wallType={wallType}
      />
      <button
        onClick={handleCloseOverlay}
        className="absolute bottom-6 text-cyan-300 hover:text-white text-3xl font-bold"
      >
        ✖
      </button>
    </div>
  </>
)}

    {/* 🔸 Active Panel */}
    <div className="panel-view" style={{ background: "#0c0c0c" }}>
      {activePanel === "left" && <PanelPostView />}
      {activePanel === "middle" && (
        <PanelFeed
          posts={posts}
          commentsMap={commentsMap}
          inputMap={inputMap}
          setInputMap={setInputMap}
          handleCommentSubmit={handleCommentSubmit}
        />
      )}
      {activePanel === "right" && <PanelNews />}
    </div>
  </div>
);
}
