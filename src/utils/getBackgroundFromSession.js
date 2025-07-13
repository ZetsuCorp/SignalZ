export const getBackgroundFromSession = (sessionId) => {
  const backgroundImages = ["test0", "test1", "test2", "test3"]; // 🔥 Only exists here
  const index = sessionId
    ? parseInt(sessionId.slice(-1), 16) % backgroundImages.length
    : 0;
  return backgroundImages[index];
};
