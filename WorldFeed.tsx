import React, { useEffect, useState } from "react";
import NewsFeed from "./NewsFeed";
import ChumFeedPanel from "./src/ChumFeedPanel";

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const safeWall = (wallType || "main").toLowerCase();
        const res = await fetch(`/.netlify/functions/get-all-posts?wall_type=${safeWall}`);
        if (!res.ok) throw new Error("Failed to fetch all posts");
        const { posts: standardPosts = [], links: linkedPosts = [] } = await res.json();

        const combined = [...standardPosts, ...linkedPosts].sort((a, b) => {
          return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
        });

        setPosts(combined);
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

  if (error) return <div style={{ textAlign: "center", color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex", width: "100%", alignItems: "flex-start" }}>
      {/* Left Panel - Chum */}
      <div style={{ width: "20%", background: "#0a0a0a", borderRight: "1px solid #222" }}>
        <ChumFeedPanel />
      </div>

      {/* Center Feed */}
      <div
        className="hide-scrollbar"
        style={{ flex: 1, padding: "1rem", background: "#0d0d0d", overflowY: "scroll" }}
      >
        {posts.length === 0 ? (
          <div style={{ color: "#777" }}>No posts yet for this wall.</div>
        ) : (
          posts.map((post) => {
            const comments = commentsMap[post.id] || [];
            const safeTags = Array.isArray(post.tags)
              ? post.tags
              : typeof post.tags === "string"
              ? post.tags.split(",").map((t) => t.trim())
              : [];

            return (
              <div key={post.id} style={{ marginBottom: "2rem" }}>
                {post.video_url ? (
                  <video src={post.video_url} controls style={{ width: "100%", borderRadius: 8 }} />
                ) : post.image_url ? (
                  <img src={post.image_url} style={{ width: "100%", borderRadius: 8 }} />
                ) : null}

                <h3 style={{ fontWeight: "bold", color: "white", fontSize: "1.2rem" }}>
                  {post.headline || post.link_title || "Untitled"}
                </h3>

                <p style={{ color: "white", fontSize: "0.9rem" }}>
                  {post.caption || "Shared via SignalZ"}
                </p>

                {(post.cta_url || post.cta_link_url) && (
                  <a
                    href={post.cta_url || post.cta_link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "linear-gradient(to right, #ff4136, #ffdc00)",
                      color: "white",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textDecoration: "none",
                      marginBottom: "0.5rem",
                      display: "inline-block",
                    }}
                  >
                    Visit Link
                  </a>
                )}

                {safeTags.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {safeTags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "#1a1a1a",
                          border: "1px solid #00f0ff55",
                          color: "white",
                          fontSize: "0.75rem",
                          borderRadius: "999px",
                          padding: "0.2rem 0.5rem",
                          marginRight: 6,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments */}
                <div style={{ marginTop: "1rem" }}>
                  <h4 style={{ color: "#00f0ff" }}>Comments</h4>
                  <div style={{ marginBottom: "0.75rem" }}>
                    {comments.map((c, i) => (
                      <p key={i} style={{ color: "white", fontSize: "0.85rem" }}>
                        💬 {c.content}
                      </p>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write a comment..."
                    value={inputMap[post.id] || ""}
                    onChange={(e) =>
                      setInputMap((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "#0d0d0d",
                      color: "white",
                      border: "1px solid #00f0ff55",
                      borderRadius: 6,
                      padding: 8,
                      fontSize: "0.85rem",
                      marginBottom: 8,
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    style={{
                      padding: "8px 16px",
                      background: "linear-gradient(to right, #00ff99, #00f0ff)",
                      color: "black",
                      border: "none",
                      borderRadius: 6,
                      fontWeight: "bold",
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

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
        <h2 style={{ color: "#00f0ff", marginBottom: "1rem" }}>🗞️ News Feed</h2>
        <iframe
          width="100%"
          height="100%"
          src="https://abcnews.go.com/video/embed?id=abc_live11"
          allowFullScreen
          frameBorder="0"
          style={{ borderRadius: "10px", border: "1px solid #00f0ff44" }}
        />
        <NewsFeed />
      </div>
    </div>
  );
}
