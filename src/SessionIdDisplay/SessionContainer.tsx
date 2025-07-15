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

  // 💾 Store matching icon path separately for reuse
  const iconPath = `/sigicons/${Sicon}`;
  sessionStorage.setItem("session_icon", iconPath);

  // ✅ NEW: Extract display name and store it
  const displayName = id.replace(/^sigicons\/[a-zA-Z0-9\-]+\.gif#/, '');
  sessionStorage.setItem("session_display_name", displayName); // ✅ NEW LINE

  return id;
}
