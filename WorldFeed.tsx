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

  return (
    <div className="flex h-screen text-white bg-black">
      {/* Left Panel - Chum Bucket */}
      <div className="w-1/5 bg-[#111] p-4 border-r border-cyan-800 overflow-y-auto">
        <h2 className="text-cyan-400 font-bold mb-2 text-sm">🪣 Chum Bucket</h2>
        <p className="text-xs text-gray-400 italic">This space will soon be AI-driven chaos.</p>
      </div>

      {/* Center Panel - Posts Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-[#0c0c0c] border-x border-cyan-900">
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => {
            const safeTags = Array.isArray(post.tags)
              ? post.tags
              : typeof post.tags === "string"
              ? post.tags.split(",").map((tag) => tag.trim())
              : [];
            const comments = commentsMap[post.id] || [];
            const commentValue = inputMap[post.id] || "";
            const isOverLimit = commentValue.length > MAX_COMMENT_LENGTH;

            return (
              <div key={post.id} className="border border-cyan-800 rounded-xl p-4">
                {post.video_url ? (
                  <video src={post.video_url} controls className="w-full rounded-lg mb-3" />
                ) : post.image_url ? (
                  <img src={post.image_url} alt="preview" className="w-full rounded-lg mb-3" />
                ) : null}

                <h3 className="text-lg font-bold">{post.headline}</h3>
                <p className="text-sm mb-2">{post.caption}</p>

                {post.cta_url && (
                  <a
                    href={post.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-red-500 to-yellow-400 text-white font-bold text-xs px-3 py-1 rounded-full mb-2"
                  >
                    Visit Link
                  </a>
                )}

                <div className="flex flex-wrap gap-2 mb-2">
                  {safeTags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#1a1a1a] border border-cyan-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Comments */}
                <div className="mt-3">
                  <h4 className="text-sm text-cyan-300 mb-1">Comments</h4>
                  <div className="space-y-1 mb-2">
                    {comments.map((comment, i) => (
                      <p key={i} className="text-sm">💬 {comment.content}</p>
                    ))}
                  </div>
                  <textarea
                    value={commentValue}
                    placeholder="Write a comment..."
                    onChange={(e) =>
                      setInputMap((prev) => ({
                        ...prev,
                        [post.id]: e.target.value.slice(0, MAX_COMMENT_LENGTH),
                      }))
                    }
                    className="w-full p-2 text-sm bg-[#111] text-white border border-cyan-600 rounded mb-1"
                  />
                  <p className={`text-xs text-right ${isOverLimit ? "text-red-400" : "text-gray-500"}`}>
                    {commentValue.length} / {MAX_COMMENT_LENGTH}
                  </p>
                  <button
                    disabled={!commentValue.trim() || isOverLimit}
                    onClick={() => handleCommentSubmit(post.id)}
                    className={`w-full mt-1 py-2 text-sm font-bold rounded ${
                      !commentValue.trim() || isOverLimit
                        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right Panel - News */}
      <div className="w-1/5 bg-[#111] p-4 border-l border-cyan-800 overflow-y-auto">
        <h2 className="text-cyan-400 font-bold mb-2 text-sm">📰 News</h2>
        <p className="text-xs text-gray-400 italic">Latest headlines will appear here.</p>
      </div>
    </div>
  );
}
