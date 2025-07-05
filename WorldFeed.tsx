import React, { useEffect, useState } from "react";

// Utility: fetch all comments for a post
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

// Utility: post a comment
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

  const MAX_COMMENT_LENGTH = 100;

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
    if (!content || !content.trim() || content.length > MAX_COMMENT_LENGTH) return;

    const ok = await submitComment(postId, content.trim(), wallType);
    if (ok) {
      const updated = await fetchComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: updated }));
      setInputMap((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  if (error) {
    return <div style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>No posts yet for this wall.</div>;
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-[20%] p-4 bg-[#111] text-white border-r border-cyan-700 overflow-y-auto">
        <h2 className="text-cyan-400 font-semibold text-sm mb-4">🪣 Chum Bucket</h2>
        <p>Coming soon...</p>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        {posts.map((post) => {
          const safeTags = Array.isArray(post.tags)
            ? post.tags
            : typeof post.tags === "string"
            ? post.tags.split(",").map((tag) => tag.trim())
            : [];

          const comments = commentsMap[post.id] || [];
          const commentValue = inputMap[post.id] || "";
          const isOverLimit = commentValue.length > MAX_COMMENT_LENGTH;
          const isEmpty = commentValue.trim() === "";

          return (
            <div key={post.id} className="post mb-10">
              {post.video_url ? (
                <video
                  controls
                  src={post.video_url}
                  className="w-full rounded border border-gray-700 mb-2"
                />
              ) : post.image_url ? (
                <img
                  src={post.image_url}
                  alt="preview"
                  className="w-full rounded border border-gray-700 mb-2"
                />
              ) : null}

              <h3 className="text-white font-bold text-lg">{post.headline}</h3>
              <p className="text-white text-sm mb-2">{post.caption}</p>

              {post.cta_url && (
                <a
                  href={post.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-red-500 to-yellow-300 text-white px-3 py-1 rounded-full text-xs font-bold mb-2"
                >
                  Visit Link
                </a>
              )}

              {safeTags.length > 0 && (
                <div className="text-white text-xs mt-2">
                  {safeTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-[#1a1a1a] border border-cyan-700 px-2 py-0.5 rounded-full mr-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-cyan-400 text-sm mb-1">Comments</h4>
                {comments.length > 5 ? (
                  <div
                    className="max-h-28 overflow-hidden relative mask-gradient mb-3"
                    style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)" }}
                  >
                    <div className="flex flex-col gap-1 animate-scrollComments">
                      {comments.map((comment, i) => (
                        <div
                          key={i}
                          className="text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          💬 {comment.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    {comments.map((comment, i) => (
                      <p key={i} className="text-white text-sm mb-1">
                        💬 {comment.content}
                      </p>
                    ))}
                  </div>
                )}

                <textarea
                  placeholder="Write a comment..."
                  value={commentValue}
                  onChange={(e) =>
                    setInputMap((prev) => ({
                      ...prev,
                      [post.id]: e.target.value.slice(0, MAX_COMMENT_LENGTH),
                    }))
                  }
                  className="w-full bg-[#0d0d0d] text-white border border-cyan-700 rounded p-2 text-sm mb-1"
                />
                <p className={`text-right text-xs mb-2 ${isOverLimit ? "text-red-500" : "text-gray-400"}`}>
                  {commentValue.length} / {MAX_COMMENT_LENGTH}
                </p>
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={isEmpty || isOverLimit}
                  className={`px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold rounded transition-opacity duration-200 ${
                    isEmpty || isOverLimit ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Panel */}
      <div className="w-[20%] p-4 bg-[#111] text-white border-l border-cyan-700 overflow-y-auto">
        <h2 className="text-cyan-400 font-semibold text-sm mb-4">📰 News</h2>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}
