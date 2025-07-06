import React, { useEffect, useState } from "react";

const NewsFeed: React.FC = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/get-news")
      .then((res) => res.json())
      .then((data) => setNewsItems(data.items || []))
      .catch(console.error);
  }, []);

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
      <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "#00f0ff" }}>📰 News Feed</h2>

      {newsItems.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#aaa" }}>Loading news...</p>
      ) : (
        newsItems.map((item, idx) => (
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
            {item.image && (
              <img
                src={item.image}
                alt="news preview"
                style={{
                  width: "100%",
                  maxHeight: "160px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              />
            )}
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
        ))
      )}
    </div>
  );
};

export default NewsFeed;
