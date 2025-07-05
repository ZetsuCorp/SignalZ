// MediaEditor.tsx
import React, { useState } from "react";

interface MediaEditorProps {
  type: "image" | "video";
  src: string;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ type, src }) => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="media-editor">
      <div className="media-frame">
        {type === "image" ? (
          <img src={src} alt="preview" style={{ transform: `scale(${zoom})` }} />
        ) : (
          <video src={src} controls style={{ transform: `scale(${zoom})` }} />
        )}
      </div>
      <input
        type="range"
        min="1"
        max="2"
        step="0.01"
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default MediaEditor;
