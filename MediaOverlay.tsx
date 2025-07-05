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
  max-width: 90vw;
  max-height: 90vh;
  background: #000;
  border-radius: 1rem;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-overlay img,
.media-overlay video {
  display: block;
  height: auto;
  width: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 1rem;
  margin: auto;
}

.media-overlay video {
  outline: none;
}

body.modal-open {
  overflow: hidden;
}
