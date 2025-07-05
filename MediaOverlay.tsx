import React, { useEffect } from "react";
import "./media-overlay.css";

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
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="media-overlay" onClick={onClose}>
      <div
        className="media-overlay-inner max-w-[640px] max-h-[480px] w-full h-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "image" ? (
          <img src={src} alt="Preview" className="w-full h-auto rounded-xl" />
        ) : (
          <video
            src={src}
            controls
            autoPlay
            loop
            className="w-full h-auto rounded-xl"
          />
        )}
      </div>
    </div>
  );
};

export default MediaOverlay;
