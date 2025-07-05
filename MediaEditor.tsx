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
        className="bg-blue-900 rounded-xl shadow-xl overflow-hidden border border-gray-300"
        style={{
          width: 640,
          height: 640,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#C0C0C0",
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
          className="px-4 py-2 bg-black bg-opacity-50 text-white rounded border border-gray-300 hover:border-white"
        >
          ✅ Confirm
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-black bg-opacity-50 text-white rounded border border-gray-300 hover:border-white"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default MediaEditor;
