import { getBackgroundFromSession } from "../utils/getBackgroundFromSession";

const bg = getBackgroundFromSession(sessionId); // uses sessionId to choose image
sessionStorage.setItem("session_bg", bg);
