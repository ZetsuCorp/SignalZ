import React, { useEffect } from "react";

interface MediaOverlayProps {
  type: "image" | "video";
  src: string;
  onClose: () => void;
}

const MediaOverlay: React.FC<MediaOverlayProps> = ({ type, src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "image" ? (
          <img src={src} alt="Preview" className="max-w-full max-h-screen rounded-xl shadow-lg" />
        ) : (
          <video
            src={src}
            controls
            autoPlay
            loop
            className="max-w-full max-h-screen rounded-xl shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default MediaOverlay;
