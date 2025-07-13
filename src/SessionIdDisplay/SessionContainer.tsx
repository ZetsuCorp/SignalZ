import React, { useEffect, useState } from "react";

// Generate or fetch session ID
function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem("session_id");
  if (existing) return existing;

  const adjectives = ["Rogue", "Quantum", "Silent", "Crimson", "Glitch", "Hyper"];
  const nouns = ["Falcon", "Wolf", "Sprite", "Bot", "Shade", "Nova"];
  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const id = `#${rand(adjectives)}_${rand(nouns)}${Math.floor(Math.random() * 9999)}`;
  sessionStorage.setItem("session_id", id);
  return id;
}

// Get or set a random background image for the session
function getOrCreateSessionBackground(): string {
  const existing = sessionStorage.getItem("session_bg");
  if (existing) return existing;

  const totalImages = 20; // ✅ Update if you add more
  const randomIndex = Math.floor(Math.random() * totalImages) + 1;
  const bg = `bg${randomIndex}`;
  sessionStorage.setItem("session_bg", bg);
  return bg;
}

export default function SessionContainer() {
  const [sessionId, setSessionId] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const id = getOrCreateSessionId();
    const bg = getOrCreateSessionBackground();

    setSessionId(id);
    setBgImage(`/postcard-assets/cardbase/${bg}.png`);
  }, []);

  return (
    <div
      className="session-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ color: "#00f0ff", fontWeight: "bold" }}>{sessionId}</div>
      <div style={{ fontSize: "13px", color: "#aaa" }}>🧠 Stats coming soon</div>
    </div>
  );
}
