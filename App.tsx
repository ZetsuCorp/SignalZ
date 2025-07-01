// App.tsx
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";
import { useState } from "react";

export default function App() {
  const [wallType, setWallType] = useState("main");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌐 SIGNALZ</h1>
      <p className="text-center mb-4 text-sm text-gray-500">
        What the internet is talking about.
      </p>
      <div className="flex gap-6">
        <div className="w-full max-w-sm sticky top-6 self-start">
          <PostForm wallType={wallType} />
        </div>
        <div className="flex-1">
          <div className="flex gap-2 justify-center mb-6">
            {[
              { id: "main", label: "Signal" },
              { id: "alt", label: "Surge" },
              { id: "zetsu", label: "Lens" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setWallType(id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow ${
                  wallType === id ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <WorldFeed wallType={wallType} />
        </div>
      </div>
    </div>
  );
}
