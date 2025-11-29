import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // The Vite proxy will forward this request to your Express backend
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Error fetching posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="post-list-container">
      <h1>Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found. Why not create one?</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
              <p className="post-category">Category: {post.category?.name || 'Uncategorized'}</p>
              <p>{post.content.substring(0, 150)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;