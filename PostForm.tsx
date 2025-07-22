import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/client";
import { getBackgroundFromSession } from "./src/utils/getBackgroundFromSession";

function PostForm() {
  const [sessionId, setSessionId] = useState("");
  const [sigIcon, setSigIcon] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    let existing = localStorage.getItem("session_id");
    if (!existing) {
      existing = uuidv4();
      localStorage.setItem("session_id", existing);
    }
    setSessionId(existing);
    setSigIcon(sessionStorage.getItem("session_icon") || "");
    setDisplayName(sessionStorage.getItem("session_display_name") || "");
    setBackgroundImage(sessionStorage.getItem("session_bg") || "");
  }, []);

  return (
    <div
      className="w-full max-w-2xl rounded-xl border border-cyan-600 shadow-lg p-6 relative text-center"
      style={{
        backgroundImage: backgroundImage
          ? `url(/postcard-assets/cardbase/${backgroundImage}.png)`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(4px)",
        color: "#00f0ff",
      }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span>{sessionId}</span>
        <span>{sigIcon}</span>
      </div>

      <div className="border border-cyan-400 rounded-md p-1 font-bold mb-4">
        {displayName || "NAME PLATE"}
      </div>
    </div>
  );
}

export default PostForm;
