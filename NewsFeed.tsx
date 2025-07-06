import React, { useEffect, useState } from "react";
import {
  Globe,
  Atom,
  Users,
  TrendingUp,
  Heart,
  Briefcase,
  Gamepad2,
} from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: Globe },
  { id: "technology", name: "Tech", icon: Atom },
  { id: "politics", name: "Politics", icon: Users },
  { id: "sports", name: "Sports", icon: TrendingUp },
  { id: "entertainment", name: "Entertainment", icon: Heart },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
];

const NewsFeed: React.FC = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/.netlify/functions/get-news")
      .then((res) => res.json())
      .then((data) => setNewsItems(data.items || []))
      .catch(console.error);
  }, []);

  const filtered = selectedCategory === "all"
    ? newsItems
    : newsItems.filter((item) =>
        item.category?.toLowerCase() === selectedCategory
      );

  return (
    <div
      style={{
        width: "100%",
        background: "#0a0a0a",
        padding: "1rem",
        borderLeft: "1px solid #222",
        color: "white",
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>
        📰 News Feed
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {categories.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              padding: "0.3rem 0.6rem",
              borderRadius: "999px",
              background: selectedCategory === id ? "#00f0ff22" : "#111",
              border: selectedCategory === id
                ? "1px solid #00f0ff"
                : "1px solid #333",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Icon size={14} /> {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#aaa" }}>Loading news...</p>
      ) : (
        filtered.map((item, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              background: "#111",
              border: "1px solid #00f0ff33",
              borderRadius: "10px",
              padding: "0.75rem",
              display: "flex",
              gap: "0.75rem",
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt="thumb"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#00cfff",
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                }}
              >
                {item.title}
              </a>
              <div style={{ fontSize: "0.65rem", color: "#888", marginTop: "0.25rem" }}>
                {item.source && <span>{item.source} · </span>}
                {item.pubDate && new Date(item.pubDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeed;
