body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f2f2f2;
  color: #111;
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Left Panel */
.left-panel {
  width: 320px;
  background: linear-gradient(to bottom, #001f3f, #003366);
  color: silver;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 3px double silver;
  box-shadow: inset -2px 0 4px rgba(255, 255, 255, 0.1);
}

.left-panel h2 {
  margin-top: 0;
  color: silver;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Form Fields */
.left-panel input,
.left-panel textarea {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid silver;
  background-color: rgba(0, 0, 0, 0.4);
  color: silver;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;
}

.left-panel input::placeholder,
.left-panel textarea::placeholder {
  color: rgba(192, 192, 192, 0.6);
  font-style: italic;
}

.left-panel input:hover,
.left-panel textarea:hover {
  background-color: rgba(0, 0, 0, 0.5);
  border-color: #ccc;
}

.left-panel input:focus,
.left-panel textarea:focus {
  outline: none;
  border-color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 4px rgba(192, 192, 192, 0.4);
}

/* File Input */
.left-panel input[type="file"] {
  background-color: rgba(0, 0, 0, 0.2);
  color: silver;
  border: 1px dashed silver;
  padding: 0.4rem;
  cursor: pointer;
}

/* Buttons */
.left-panel button {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid silver;
  background-color: rgba(0, 0, 0, 0.6);
  color: silver;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.left-panel button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
}

/* Right Panel */
.right-panel {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Tabs */
.tab {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: bold;
  background-color: white;
  border: 1px solid silver;
  cursor: pointer;
  margin-right: 0.5rem;
}

.tab.active {
  background: linear-gradient(to right, #ff4136, #ffdc00);
  color: white;
  border: none;
}

/* Post Styles */
.post {
  background: white;
  border: 1px solid silver;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Signal Source */
.signal-source {
  border-top: 1px solid silver;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: silver;
}

.signal-source h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #c0c0c0;
}

.source-pill {
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid silver;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  display: inline-block;
  font-weight: bold;
  color: silver;
  margin-bottom: 0.5rem;
}

.source-desc {
  font-size: 0.75rem;
  line-height: 1.3;
  color: #aaa;
}

/* Settings Drawer */
.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #001f3f;
  color: silver;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-drawer h3 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #ddd;
}

.settings-drawer button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid silver;
  background-color: rgba(0, 0, 0, 0.4);
  color: silver;
  font-weight: bold;
  cursor: pointer;
}

/* Toggle Row */
.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  color: silver;
  cursor: pointer;
}

.toggle-row input[type="checkbox"] {
  accent-color: silver;
  transform: scale(1.1);
}

/* Dark Mode */
body.dark-mode {
  background-color: #0a0a0a;
  color: #ddd;
}

body.dark-mode .right-panel {
  background-color: #111;
}

body.dark-mode .tab {
  background-color: #222;
  color: silver;
  border: 1px solid #666;
}

body.dark-mode .tab.active {
  background: linear-gradient(to right, #ff4136, #ffdc00);
  color: black;
}

/* Monetize Panel */
.monetize-panel {
  border-top: 1px solid silver;
  padding-top: 1rem;
}

.monetize-panel h3 {
  color: #c0c0c0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.monetize-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid silver;
  border-radius: 8px;
  color: silver;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s ease;
}

.monetize-link:hover {
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
}
