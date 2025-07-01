// WorldFeed.tsx
import React from "react";

interface Props {
  wallType: string;
}

export default function WorldFeed({ wallType }: Props) {
  return (
    <div className="bg-white rounded-lg p-6 shadow text-center text-gray-500">
      <p>WorldFeed for <strong>{wallType}</strong> wall coming soon...</p>
    </div>
  );
}
