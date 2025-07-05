// MediaEditor.tsx
import React, { useState, useRef, useEffect } from "react";

interface MediaEditorProps {
  type: "image" | "video";
  src: string;
  onClose: () => void;
  onConfirm: (blobUrl: string) => void;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ type, src, onClose, onConfirm }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-4 p-4">
      <div
        ref={containerRef}
        className="bg-black rounded-xl shadow-xl overflow-hidden"
        style={{
          width: 640,
          height: 640,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {type === "image" ? (
          <img
            src={src}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.2s",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            alt="Preview"
          />
        ) : (
          <video
            src={src}
            controls
            autoPlay
            loop
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.2s",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      <input
        type="range"
        min="1"
        max="3"
        step="0.01"
        value={zoom}
        onChange={(e) => setZoom(parseFloat(e.target.value))}
        className="w-64"
      />

      <div className="flex space-x-4">
        <button
          onClick={() => onConfirm(src)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✅ Confirm
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default MediaEditor;
