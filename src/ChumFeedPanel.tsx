import React from "react";
import chumPosts from "./chumData";

const ChumFeedPanel: React.FC = () => {
  return (
    <div
      className="hide-scrollbar"
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: "1rem",
        background: "#0a0a0a",
        borderRight: "1px solid #222",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>🪣 Chum Feed</h2>

      {chumPosts.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "1rem",
            background: "#111",
            border: "1px solid #00f0ff33",
            borderRadius: "10px",
            padding: "0.75rem",
          }}
        >
          <img
            src={item.image_url}
            alt={item.caption}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          />
          <p
            style={{
              fontSize: "0.85rem",
              color: "#ccc",
              marginBottom: "0.5rem",
            }}
          >
            {item.caption}
          </p>

          {item.cta_url && (
            <a
              href={item.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(to right, #00ff99, #00f0ff)",
                color: "black",
                padding: "0.4rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Visit Link
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChumFeedPanel;
