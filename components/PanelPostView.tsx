import React from "react";
import PostcardViewer from "../tcg-template/PostcardViewer";
import PostStatsView from "../src/PostStatsView";
import ChumFeedPanel from "../src/ChumFeedPanel";
 
export default function PanelPostView({ onPushToWall }) {
  return (
    <div className="left-feed">
      <PostcardViewer onPushToWall={onPushToWall} />
      <PostStatsView />
      <ChumFeedPanel />
    </div>
  );
}
 
