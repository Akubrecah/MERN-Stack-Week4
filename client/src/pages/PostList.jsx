import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Hero from '../components/Hero';

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
    <>
      <Hero />
      <div className="post-list-container" id="latest-posts">
        <div className="section-header">
          <h2>Latest Articles</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Search topics..."
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
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-image-container">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} className="post-image" />
                  ) : (
                    <div className="post-image-placeholder"></div>
                  )}
                  <span className="post-category-badge">{post.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="post-content-preview">
                  <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <Link to={`/posts/${post._id}`} className="read-more">Read More &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PostList;