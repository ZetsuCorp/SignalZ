import React from "react";

export default function TCGCardTemplate({
  headline,
  caption,
  image_url,
  video_url,
  sigicon_url,
  display_name,
  created_at,
  background,
}) {
  return (
    <div
      className="tcg-card"
      style={{
        position: "relative",
        backgroundImage: background
          ? `url('/postcard-assets/cardbase/${background}.png')`
          : "repeating-linear-gradient(45deg, #222, #111 10px)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px",
        border: "4px solid rgba(0, 255, 255, 0.5)",
        boxShadow: "0 0 15px #00f0ff55",
        padding: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* 🌐 Holo Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,255,255,0.08) 100%)",
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* 🔹 Display Name */}
        {display_name && (
          <div style={{ width: "100%", textAlign: "center", marginBottom: "0.5rem" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "0.85rem",
                color: "#00f0ff",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "4px 8px",
                borderRadius: "6px",
                textShadow: "0 0 6px #00f0ff",
                display: "inline-block",
              }}
            >
              {display_name}
            </span>
          </div>
        )}

        {/* 🧾 Headline */}
        <div
          style={{
            background: "linear-gradient(145deg, #0ff, #033)",
            border: "2px solid #00f0ff88",
            borderRadius: "10px",
            padding: "8px 16px",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#ffffff",
            textShadow: "0 0 2px #0ff, 0 0 5px #0ff",
            boxShadow:
              "inset 0 2px 5px rgba(255,255,255,0.2), inset 0 -2px 5px rgba(0,0,0,0.3), 0 4px 8px rgba(0,255,255,0.2)",
            margin: "0.5rem 0 0.75rem",
          }}
        >
          📛 {headline || "Untitled"}
        </div>

        {/* 📂 Type Placeholder */}
        <div
          style={{
            fontSize: "0.85rem",
            color: "#ccc",
            marginBottom: "1rem",
          }}
        >
          📂 Type — SIGZICON
        </div>

        {/* 🎥 Media */}
        {video_url ? (
          <video
            controls
            src={video_url}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "0.5rem",
            }}
          />
        ) : image_url ? (
          <img
            src={image_url}
            alt="preview"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "0.5rem",
            }}
          />
        ) : null}

        {/* ☄️ Sigicon */}
        {sigicon_url && (
          <div
            style={{
              position: "absolute",
              top: "0.5rem",
              left: "0.5rem",
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px",
            }}
          >
            <img
              src={sigicon_url}
              alt="sigicon"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
          </div>
        )}

        {/* 📦 Description */}
        <div
          style={{
            background: "rgba(0, 10, 20, 0.65)",
            border: "1px solid #00f0ff44",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#e0fefe",
            fontSize: "0.85rem",
            lineHeight: "1.4",
            boxShadow: "inset 0 0 10px rgba(0, 255, 255, 0.1)",
            backdropFilter: "blur(6px)",
            marginBottom: "0.75rem",
          }}
        >
          {headline && (
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "0.25rem",
              }}
            >
              {headline}
            </div>
          )}

          {caption && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "#cfffff",
                marginBottom: "0.5rem",
              }}
            >
              {caption}
            </p>
          )}

          {created_at && (
            <div style={{ fontSize: "0.75rem", color: "#88ffff" }}>
              {new Date(created_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
