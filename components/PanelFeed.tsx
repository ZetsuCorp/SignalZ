import React from "react";

export default function PanelFeed({ posts }) {
  return (
    <div className="middle-feed">
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            marginTop: "2rem",
            borderBottom: "1px solid #222",
            paddingBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#00ffff",
            }}
          >
            {post.headline}
          </div>
        </div>
      ))}
    </div>
  );
}
