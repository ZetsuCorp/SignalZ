import React from 'react';
import PostForm from './PostForm';
import WorldFeed from './WorldFeed';
import './index.css'; // ← ✅ include the CSS file

function App() {
  return (
    <div className="app">
      <PostForm />
      <WorldFeed />
    </div>
  );
}

export default App;
