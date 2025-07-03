import Sidebar from "./Sidebar";
import "./App.css"; // your custom CSS styles

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel (scrollable if content is long) */}
      <div className="left-panel overflow-y-auto">
        <Sidebar />
      </div>

      {/* Right panel (main content area) */}
      <div className="right-panel flex-1 overflow-y-auto">
        <h1>Main Content</h1>
        <p>This area will scroll independently from the sidebar.</p>
      </div>
    </div>
  );
}

