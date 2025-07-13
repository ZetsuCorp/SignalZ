import React, { useEffect, useState } from "react";

// Simple hash function to turn sessionId into a number
function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Force 32-bit
  }
  return Math.abs(hash);
}

// Get or generate session ID
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

const backgroundList = [
  "bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "bg7", "bg8", "bg9", "bg10"
];

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
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        textShadow: "1px 1px 2px #000",
        width: "100%",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      <h2>You are:</h2>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{sessionId}</div>
    </div>
  );
}
