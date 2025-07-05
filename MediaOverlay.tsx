/* MediaOverlay.css */

.media-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: auto;
}

.media-overlay-inner {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  background: #000;
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.media-overlay img,
.media-overlay video {
  display: block;
  width: 100%;
  height: auto;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 1rem;
}

.media-overlay video {
  outline: none;
}

body.modal-open {
  overflow: hidden;
}
