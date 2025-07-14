import React, { useEffect, useState } from "react";

// 🔥 Random pick utility
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ✅ Generate or fetch session ID with emoji logic + sigicon prefix
function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem("session_id");
  if (existing) return existing;

  const nouns = [
    "Tiger", "Crab", "Falcon", "Waffle", "Wizard", "Rocket", "Toaster", "Donut",
    "Ninja", "Slug", "Ghost", "Planet", "Monkey", "Cloud", "Pumpkin"
  ];

  const adjectives = [
    "Funky", "Angry", "Lazy", "Crimson", "Dizzy", "Bouncy", "Spicy", "Wiggly",
    "Happy", "Greedy", "Zesty", "Electric", "Sneaky", "Cheesy", "Jumpy"
  ];

  const animals = {
    Panther: "🐆", Otter: "🦦", Giraffe: "🦒", Frog: "🐸", Penguin: "🐧",
    Horse: "🐴", Dog: "🐶", Bear: "🐻", Llama: "🦙"
  };

  const furniture = {
    Couch: "🛋️", Chair: "🪑", Desk: "🧮", Stool: "🪑", Cabinet: "🗄️",
    Lamp: "💡", Table: "🪟", Shelf: "📚", Drawer: "🧰"
  };

  const foods = {
    Pizza: "🍕", Burger: "🍔", Taco: "🌮", Sushi: "🍣", Pasta: "🍝",
    Pancake: "🥞", Noodle: "🍜", Toast: "🍞", Dumpling: "🥟"
  };

  const allThings = { ...animals, ...furniture, ...foods };
  const thingNames = Object.keys(allThings);

  const iconList = [
    "burn.gif", "deal-with-it.gif", "flip.gif", "glitch.gif", "gun.gif",
    "hearts.gif", "intensifies.gif", "on-fire.gif", "panic.gif", "party-blob.gif",
    "party-parrot.gif", "ripple.gif", "shake.gif", "spiral-in.gif", "thanos-snap.gif",
    "tumble.gif", "wave.gif", "weird.gif", "zoom.gif"
  ];

  const Sicon = pick(iconList);
  const part1 = pick(nouns);
  const part2 = pick(adjectives);
  const part3 = pick(nouns);
  const finalThing = pick(thingNames);

  const matchedEmoji = allThings[finalThing] || "";
  const flairEmojis = ["🔥", "💀", "✨", "🌀", "🚀", "🎯", "🤖", "💎", "👾", "🌈"];
  const flair = pick(flairEmojis);

  const id = `sigicons/${Sicon}#${part1}${part2}${part3}${finalThing}${matchedEmoji}${flair}`;
  sessionStorage.setItem("session_id", id);
  return id;
}

// 🎨 Background image
function getOrCreateSessionBackground(): string {
  const existing = sessionStorage.getItem("session_bg");
  if (existing) return existing;

  const totalImages = 4;
  const randomIndex = Math.floor(Math.random() * totalImages);
  const bg = `test${randomIndex}`;
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

  const imgMatch = sessionId.match(/^sigicons\/([a-zA-Z0-9\-]+\.gif)/);
  const imgPath = imgMatch ? `/sigicons/${imgMatch[1]}` : null;
  const cleanName = sessionId.replace(/^sigicons\/[a-zA-Z0-9\-]+\.gif/, '');

  return (
    <div
      className="session-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "1em"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          background: "rgba(0, 0, 0, 0.65)",
          borderRadius: "12px",
          padding: "0.75em 1.25em",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          width: "fit-content",
        }}
      >
        {imgPath && (
          <img
            src={imgPath}
            alt="sigicon"
            style={{
              width: "2.25em",
              height: "1em",
              borderRadius: "6px",
              objectFit: "contain"
            }}
          />
        )}
        <div
          style={{
            color: "#00f0ff",
            fontWeight: "bold",
            fontSize: "1rem",
            overflowWrap: "break-word"
          }}
        >
          {cleanName}
        </div>
      </div>
    </div>
  );
}
