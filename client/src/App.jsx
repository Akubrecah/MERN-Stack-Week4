import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './pages/PostList';
import SinglePost from './pages/SinglePost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<SinglePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;