import React, { useState, useRef, useEffect } from "react";
import "./MediaEditor.css";

interface MediaEditorProps {
  type: "image";
  src: string;
  onClose: () => void;
  onConfirm: (blobUrl: string) => void;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ type, src, onClose, onConfirm }) => {
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="media-overlay">
      <div className="media-overlay-inner">
        {type === "image" && (
          <div className="media-frame">
            <img
              ref={imageRef}
              src={src}
              alt="Preview"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        )}

        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="zoom-slider"
        />

        <div className="editor-controls">
          <button onClick={() => onConfirm(src)} className="confirm-btn">✅ Confirm</button>
          <button onClick={onClose} className="cancel-btn">❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditor;
