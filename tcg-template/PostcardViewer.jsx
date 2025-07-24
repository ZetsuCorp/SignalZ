import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import TCGCardTemplate from "./TCGCardTemplate";
import EmptyCard from "./EmptyCard";
import { getOrCreateSessionId } from "../utils/getOrCreateSessionId";
import { getOrCreateSessionBackground } from "../utils/getOrCreateSessionBackground";

export default function PostcardViewer() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    const bg = getOrCreateSessionBackground();
    setBgImage(`/postcard-assets/cardbase/${bg}.png`);

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

  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        background: "#0a0a0a",
        borderBottom: "1px solid #222",
        position: "relative",
        zIndex: 5,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
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
        <TCGCardTemplate {...post} />
      ) : (
        <EmptyCard />
      )}
    </div>
  );
}
