export const getBackgroundFromSession = () => {
  // Pull the pre-selected background from sessionStorage
  const stored = sessionStorage.getItem("session_bg");

  // Fallback to default if not found
  return stored || "/postcard-assets/cardbase/test0.png";
};
