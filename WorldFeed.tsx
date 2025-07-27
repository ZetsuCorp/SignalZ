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
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`;
  }
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    return match ? `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1` : null;
  }
  return null;
}
/////////////////////////////////////////////////////////////
// ✅ Fetch comments
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
    <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", height: "100vh", padding: "0 1rem" }}>
      {showCreateOverlay && (
        <CreatePostShell mode={createMode} closeOverlay={handleCloseOverlay} />
      )}

      <PostForm
        wallType={wallType}
        overlayType="classic"
        onMediaPreview={() => {}}
        closeOverlay={handleCloseOverlay}
      />

      {/* Post loop starts here */}
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "2rem", background: "#111", padding: "1rem", borderRadius: "10px" }}>
          <h3 style={{ color: "#00ffee", marginBottom: "0.5rem" }}>{post.headline}</h3>
          <p style={{ color: "#ccc" }}>{post.caption}</p>

          {post.media_url && (
            isYouTubeOrTikTok(post.media_url) ? (
              <iframe
                src={getEmbedUrl(post.media_url)}
                data-src={getEmbedUrl(post.media_url)}
                allow="autoplay; encrypted-media"
                allowFullScreen
                width="100%"
                height="315"
                frameBorder="0"
                style={{ borderRadius: "8px", marginTop: "1rem" }}
              />
            ) : post.media_url.endsWith(".mp4") ? (
              <video
                src={post.media_url}
                controls
                width="100%"
                height="auto"
                style={{ marginTop: "1rem", borderRadius: "8px" }}
              />
            ) : (
              <img
                src={post.media_url}
                alt=""
                style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
              />
            )
          )}

          <p style={{ fontSize: "0.8rem", color: "#777", marginTop: "0.5rem" }}>
            {extractDomain(post.cta_url)}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              value={inputMap[post.id] || ""}
              onChange={(e) =>
                setInputMap((prev) => ({ ...prev, [post.id]: e.target.value }))
              }
              placeholder="Leave a comment..."
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            />
            <button
              onClick={() => handleCommentSubmit(post.id)}
              style={{ padding: "0.5rem 1rem", background: "#00ffee", color: "#000", border: "none", borderRadius: "4px" }}
            >
              Comment
            </button>
          </div>

          {commentsMap[post.id]?.length > 0 && (
            <div style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
              {commentsMap[post.id].map((comment, idx) => (
                <div key={idx} style={{ marginBottom: "0.5rem", color: "#aaa" }}>
                  {comment.content}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>

    {/* 🟦 Right Panel */}
    <div className="news-panel" style={{ width: "20%", borderLeft: "1px solid #222" }}>
      <NewsFeed />
    </div>
  </div>
);
