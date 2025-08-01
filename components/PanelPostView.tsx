import React from "react";
import PostcardViewer from "../tcg-template/PostcardViewer";
//import PostStatsView from "../src/PostStatsView";
import ChumFeedPanel from "../src/ChumFeedPanel";

export default function PanelPostView() {
  return (
    <div className="left-feed">
      <PostcardViewer />
      <PostStatsView />
      <ChumFeedPanel />
    </div>
  );
}
