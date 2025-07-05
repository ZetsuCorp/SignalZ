/* MediaOverlay.css */

.media-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: auto;
}

.media-overlay-inner {
  background: #111;
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
  max-width: 90vw;
  max-height: 90vh;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.media-overlay img,
.media-overlay video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.75rem;
  display: block;
}
