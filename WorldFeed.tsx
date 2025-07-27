import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed";
import ChumFeedPanel from "./src/ChumFeedPanel";
import PostForm from "./PostForm"; // ✅ keep using your working form
import CreatePostShell from "./CreatePostShell";
import PostcardViewer from "./tcg-template/PostcardViewer";
import PostStatsView from "./src/PostStatsView";


/////////////////////////////////////////////////////
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
  return https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0:
  }
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    return match ? https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1 : null;
  }
  return null;
}
/////////////////////////////////////////////////////////////
// ✅ Fetch comments
async function fetchComments(postId) {
  try {
    const res = await fetch(/.netlify/functions/get-comments?post_id=${postId});
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
}

// ✅ Submit a comment
async function submitComment(postId, content, wallType) {
  const res = await fetch("/.netlify/functions/create-comment", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, content, wall_type: wallType }),
  });
  return res.ok;
}
////////////////////////////////////////////////////////////////////////
export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [commentsMap, setCommentsMap] = useState({});
  const [inputMap, setInputMap] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const safeWall = (wallType || "main").toLowerCase();
        const res = await fetch(/.netlify/functions/get-posts?wall_type=${safeWall});
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

/// video playback ///
/// video playback ///
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
            // For embeds, reload to stop them when not visible
            if (!isVisible && el.dataset.src) {
              el.src = ""; // clear it
            } else if (isVisible && el.dataset.src && el.src === "") {
              el.src = el.dataset.src; // restore it
            }
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // trigger when 60% visible
    }
  );

  // Observe all videos and iframes
  const allMedia = document.querySelectorAll("video, iframe");
  allMedia.forEach((el) => {
    // Save the original src to restore later
    if (el.tagName === "IFRAME") {
      el.dataset.src = el.src;
    }
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
////////////////////////////////////
  // 🔘 Create Post Overlay Logic
const [showCreateMenu, setShowCreateMenu] = useState(false);
const [showCreateOverlay, setShowCreateOverlay] = useState(false);
const [createMode, setCreateMode] = useState(""); // "image", "video", "link"

const handleCreate = (mode) => {
  setCreateMode(mode);
  setShowCreateOverlay(true);
  setShowCreateMenu(false);
};

const handleCloseOverlay = () => {
  setShowCreateOverlay(false);
  setCreateMode("");
};


////////////postcardviwer//////////////
const [showPostcardViewer, setShowPostcardViewer] = useState(false);

  
//////////////////////////
  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }
  return (
  <div style={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
    {/* 🟥 Left Panel */}
    <div className="left-panel" style={{ width: "20%", borderRight: "1px solid #222" }}>
      <PostcardViewer />
      <PostStatsView />
      <ChumFeedPanel />
    </div>

    {/* ⚫ Main Panel */}
    <div className="main-panel" style={{ width: "60%" }}>
          
{showCreateOverlay && (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(10,10,10,0.95)",
      zIndex: 999999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    }}
  >
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        padding: "2rem",
        borderRadius: "16px",
        background: "linear-gradient(145deg, #0d0d0d, #060c0d)",
        border: "16px solid rgba(0, 255, 255, 0.4)",
        boxShadow:
          "inset 0 0 30px rgba(0,255,255,0.08), 0 0 12px rgba(0,255,255,0.3), 0 0 30px rgba(0,255,255,0.1)",
        backdropFilter: "blur(6px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ✅ Let PostForm handle title and ✖ logic */}
      <PostForm
        wallType={wallType}
        onMediaPreview={() => {}}
        createMode={createMode}
        closeOverlay={() => setShowCreateOverlay(false)} // ✅ pass down
      />
    </div>
  </div>
)}





    {/* 🟦 Right Panel */}
    <div className="news-panel" style={{ width: "20%", borderLeft: "1px solid #222" }}>
      {/* placeholder for iframe + NewsFeed */}
      </div>
    </div>
  );
}
