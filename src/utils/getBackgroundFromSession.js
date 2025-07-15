export const getBackgroundFromSession = (sessionId) => {
  const totalImages = 4;
  const index = sessionId
    ? parseInt(sessionId.slice(-1), 16) % totalImages
    : 0;
  return `/postcard-assets/cardbase/test${index}.png`;
};
