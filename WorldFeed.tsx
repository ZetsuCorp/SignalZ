import React, { useEffect, useState } from "react";

// ✅ Correct Panel Imports
import PanelPostView from "@/components/PanelPostView";
import PanelFeed from "@/components/PanelFeed";
import PanelNews from "@/components/PanelNews";

// ✅ Main Component
export default function WorldFeed({ wallType }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
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

      {/* 🔸 Panel Switch */}
      <div className="panel-view" style={{ background: "#0c0c0c" }}>
        {activePanel === "left" && <PanelPostView />}
        {activePanel === "middle" && <PanelFeed posts={posts} />}
        {activePanel === "right" && <PanelNews />}
      </div>

      {/* ✅ Floating Create Button */}
      <button className="floating-create-btn" onClick={() => setActivePanel("left")}>
        +
      </button>
    </div>
  );
}
