import React from "react";
import TCGCardTemplate from "./tcg-template/TCGCardTemplate";

export default function PostForm() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <TCGCardTemplate
        headline=""
        caption=""
        image_url=""
        video_url=""
        sigicon_url=""
        display_name=""
        created_at=""
        background=""
        cta_url=""
        likes={0}
        comments={[]}
      />
    </div>
  );
}
