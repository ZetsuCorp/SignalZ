import React from "react";
import NewsFeed from "../NewsFeed";

export default function PanelNews() {
  return (
    <div className="right-feed">
      <h2
        style={{
          marginBottom: "1rem",
          fontSize: "1rem",
          color: "#00f0ff",
        }}
      >
        🗞️ News Feed
      </h2>
      <iframe
        width="100%"
        height="240"
        src="https://abcnews.go.com/video/embed?id=abc_live11"
        allowFullScreen
        frameBorder="0"
        style={{
          borderRadius: "10px",
          border: "1px solid #00f0ff44",
          objectFit: "cover",
          marginBottom: "1rem",
        }}
      ></iframe>
      <NewsFeed />
    </div>
  );
}
