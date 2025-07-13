import React, { useEffect, useState } from "react";

// Hash session ID to a number
function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

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

// Backgrounds: update count to match your actual cardbase image total
const backgroundList = Array.from({ length: 20 }, (_, i) => `bg${i + 1}`);

export default function SessionContainer() {
  const [sessionId, setSessionId] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    const imageKey = hash(id) % backgroundList.length;
    const selectedBg = backgroundList[imageKey];
    setBgImage(`/postcard-assets/cardbase/${selectedBg}.png`);
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
