import React from "react";

export default function PostStatsView() {
  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        background: "linear-gradient(to bottom, #001418, #000c12)",
        border: "2px solid #00f0ff33",
        borderRadius: "14px",
        boxShadow: "0 0 12px rgba(0,255,255,0.15)",
        color: "#00f0ff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Visual Meter Row */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>👁️</span>
        <div style={{ flex: 1, background: "#002233", height: "8px", borderRadius: "4px" }}>
          <div
            style={{
              width: "82%", // 💡 simulate power
              height: "100%",
              background: "linear-gradient(90deg, #00f0ff, #0044ff)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>💬</span>
        <div style={{ flex: 1, background: "#002233", height: "8px", borderRadius: "4px" }}>
          <div
            style={{
              width: "50%", // 💡 simulate comments
              height: "100%",
              background: "linear-gradient(90deg, #00ffcc, #0099cc)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>❤️</span>
        <div style={{ flex: 1, background: "#002233", height: "8px", borderRadius: "4px" }}>
          <div
            style={{
              width: "20%", // 💡 simulate likes
              height: "100%",
              background: "linear-gradient(90deg, #ff00cc, #ff6600)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* Signal Score Visual */}
      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          fontSize: "0.85rem",
          letterSpacing: "1px",
          opacity: 0.8,
        }}
      >
        <span style={{ opacity: 0.4 }}>Z-Charge</span>
        <div
          style={{
            marginTop: "0.5rem",
            height: "6px",
            width: "80%",
            marginInline: "auto",
            borderRadius: "3px",
            background: "linear-gradient(90deg, #00ffcc, #00f0ff)",
            boxShadow: "0 0 6px #00f0ffaa",
          }}
        />
      </div>
    </div>
  );
}
