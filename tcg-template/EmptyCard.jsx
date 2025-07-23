import React from "react";
import TCGCardTemplate from "./TCGCardTemplate";

export default function EmptyCard() {
  return (
    <TCGCardTemplate
      headline="No Post Yet"
      caption="Create your first post to see it here."
      image_url=""
      video_url=""
      sigicon_url=""
      display_name="⚠️ Not Set"
      created_at={new Date().toISOString()}
      background="empty" // make sure this file exists in /postcard-assets/cardbase/empty.png
    />
  );
}
