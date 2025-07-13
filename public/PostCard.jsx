import React from "react";

export default function PostCard({ post, comments }) {
  const backgroundImages = [
    "test0.png",
    "test1.png",
    "test2.png",
    "test3.png",
  ];

  const index = post.session_id
    ? parseInt(post.session_id.slice(-1), 16) % backgroundImages.length
    : 0;

  const backgroundImageUrl = `/postcard-assets/cardbase/${backgroundImages[index]}`;

  return (
    <div
      className="post-card"
      style={{
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem",
      }}
    >
      <div style={{ position: "relative", zIndex: 2 }}>
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post media"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "0.75rem",
            }}
          />
        )}

        <h3 style={{ fontSize: "1.1rem", color: "white" }}>{post.headline}</h3>
        <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{post.caption}</p>
      </div>
    </div>
  );
}
