import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/posts', {
          params: { search, category },
        });
        setPosts(response.data);
      } catch (err) {
        setError('Error fetching posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="post-list-container">
      <div className="header-actions">
        <h1>Blog Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">Create New Post</Link>
      </div>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
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