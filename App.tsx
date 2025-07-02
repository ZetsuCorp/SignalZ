import React, { useState, useEffect } from "react";
import PostForm from "./PostForm";
import WorldFeed from "./WorldFeed";

export default function App() {
  const [wallType, setWallType] = useState("main");

  useEffect(() => {
    console.log("SignalZ App mounted");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-yellow-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">🌐 SIGNALZ</h1>
      <p className="text-center mb-4 text-sm text-gray-500">
        What the internet is talking about.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sticky PostForm on Left */}
        <div className="lg:col-span-1 sticky top-6 self-start bg-blue-50 rounded-xl shadow-xl p-4 border border-blue-200">
          <PostForm wallType={wallType} />
        </div>

        {/* WorldFeed on Right */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 justify-center mb-6">
            {["main", "alt", "zetsu"].map((id) => (
              <button
                key={id}
                onClick={() => setWallType(id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
                  wallType === id
                    ? "bg-gradient-to-r from-red-500 to-yellow-400 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-md">
            <WorldFeed wallType={wallType} />
          </div>
        </div>
      </div>
    </div>
  );
}

