export const getBackgroundFromSession = (sessionId) => {
  const totalImages = 4; // Update this number if you add more images
  const index = sessionId
    ? parseInt(sessionId.slice(-1), 16) % totalImages
    : 0;
     return `background${index}.png`;
};
