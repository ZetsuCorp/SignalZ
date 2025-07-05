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

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black text-white">
      {/* Left Panel - Chum Bucket */}
      <aside className="w-[20%] bg-[#111] p-4 border-r border-cyan-700 overflow-y-auto">
        <h2 className="text-cyan-400 font-semibold text-sm mb-4">🪣 Chum Bucket</h2>
        <div className="text-gray-400 text-xs italic">Coming soon...</div>
      </aside>

      {/* Center Panel - Feed */}
      <main className="flex-1 bg-[#0c0c0c] p-4 overflow-y-auto border-x border-cyan-800 space-y-6">
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#777", padding: "1rem" }}>
            No posts yet for this wall.
          </div>
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
            const isEmpty = commentValue.trim() === "";

            return (
              <div key={post.id} className="post border border-cyan-800 rounded-xl p-4">
                {post.video_url ? (
                  <video src={post.video_url} controls className="w-full rounded-lg mb-3" />
                ) : post.image_url ? (
                  <img src={post.image_url} alt="preview" className="w-full rounded-lg mb-3" />
                ) : null}

                <h3 className="text-lg font-bold text-white">{post.headline}</h3>
                <p className="text-sm text-white mb-2">{post.caption}</p>

                {post.cta_url && (
                  <a
                    href={post.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white text-sm px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-yellow-400 font-semibold mb-2"
                  >
                    Visit Link
                  </a>
                )}

                {safeTags.length > 0 && (
                  <div className="text-sm text-white mb-2 space-x-2">
                    {safeTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-[#1a1a1a] border border-cyan-600 rounded-full px-3 py-1 text-xs text-white"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments */}
                <div className="mt-3">
                  <h4 className="text-sm text-cyan-300 mb-1">Comments</h4>
                  <div className="space-y-1 mb-2">
                    {comments.length > 5 ? (
                      <div className="max-h-[120px] overflow-hidden relative mask-fade">
                        <div className="animate-scroll space-y-1">
                          {comments.map((comment, i) => (
                            <p key={i} className="text-sm text-white truncate">💬 {comment.content}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      comments.map((comment, i) => (
                        <p key={i} className="text-sm text-white">💬 {comment.content}</p>
                      ))
                    )}
                  </div>

                  <textarea
                    placeholder="Write a comment..."
                    value={commentValue}
                    onChange={(e) =>
                      setInputMap((prev) => ({
                        ...prev,
                        [post.id]: e.target.value.slice(0, MAX_COMMENT_LENGTH),
                      }))
                    }
                    className="w-full bg-[#0d0d0d] border border-cyan-600 rounded p-2 text-sm text-white mb-1"
                  />
                  <p className={`text-right text-xs ${isOverLimit ? "text-red-400" : "text-gray-400"}`}>
                    {commentValue.length} / {MAX_COMMENT_LENGTH}
                  </p>
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={isEmpty || isOverLimit}
                    className={`mt-1 w-full py-2 rounded font-bold text-sm ${
                      isEmpty || isOverLimit
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
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
      </main>

      {/* Right Panel - News */}
      <aside className="w-[20%] bg-[#111] p-4 border-l border-cyan-700 overflow-y-auto">
        <h2 className="text-cyan-400 font-semibold text-sm mb-4">📰 News</h2>
        <div className="text-gray-400 text-xs italic">Top headlines coming soon...</div>
      </aside>
    </div>
  );
}
