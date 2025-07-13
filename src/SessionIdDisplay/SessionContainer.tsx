import React, { useEffect, useState } from "react";

// Simple hash function to map session ID to image index
function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate or retrieve session ID
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
      className="session-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h2 style={{ marginBottom: "8px" }}>You are:</h2>
      <div style={{ fontSize: "1.3rem" }}>{sessionId}</div>
    </div>
  );
}

