import React from "react";
import Sidebar from "./Sidebar";
import "./app.css"; // your original styles

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="right-panel">
        {/* Add your page content or routes here */}
        <h1>Welcome to SIGNALZ</h1>
        <p>This is your new main layout with a styled sidebar.</p>
      </main>
    </div>
  );
}

export default App;
