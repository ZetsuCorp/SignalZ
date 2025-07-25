import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import TCGCardTemplate from "./TCGCardTemplate";
import EmptyCard from "./EmptyCard";

export default function PostcardViewer() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("session_id");
    const sessionBg = sessionStorage.getItem("session_bg");
    setBgImage(`/postcard-assets/cardbase/${sessionBg || "test0"}.png`);

    if (!sessionId) {
      console.warn("No session ID found.");
      setLoading(false);
      return;
    }

    const fetchLastPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.warn("⚠️ No post found for session:", sessionId);
        setPost(null);
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    fetchLastPost();
  }, []);

  // 👇 Fetch views + comments once post is loaded
  useEffect(() => {
    if (!post || !post.id) return;

    const fetchStats = async () => {
      // Fetch view count
      const { count: views } = await supabase
        .from("views")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      setViewCount(views || 0);

      // Fetch comments
      try {
        const res = await fetch(`/.netlify/functions/get-comments?post_id=${post.id}`);
        const comments = res.ok ? await res.json() : [];
        setCommentCount(comments.length || 0);
      } catch (err) {
        console.warn("Error loading comments:", err);
      }
    };

    fetchStats();
  }, [post]);

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        background: "#000",
        borderBottom: "1px solid #222",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          border: "8px solid cyan",
          borderRadius: "20px",
          padding: "8px",
          backgroundColor: "#111",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "#00f0ff",
              fontSize: "1rem",
              marginBottom: "0.5rem",
              textAlign: "center",
              textShadow: "0 0 4px #00f0ff66",
            }}
          >
            🧵 Session Postcard Preview
          </h2>

          {loading ? (
            <div style={{ color: "#888", textAlign: "center" }}>Loading...</div>
          ) : post ? (
            <>
              <TCGCardTemplate {...post} />

              {/* 📊 Post Stats Viewer */}
              <div
                style={{
                  marginTop: "1rem",
                  background: "rgba(0, 10, 20, 0.65)",
                  border: "2px solid #00f0ff33",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                  color: "#00f0ff",
                  fontSize: "0.9rem",
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "1rem",
                }}
              >
                <div>❤️ Likes: {post.likes || 0}</div>
                <div>💬 Comments: {commentCount}</div>
                <div>👁️ Views: {viewCount}</div>
              </div>
            </>
          ) : (
            <EmptyCard />
          )}
        </div>
      </div>
    </div>
  );
}
