import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import axios from 'axios';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: '',
  });

  const isEditMode = !!id;

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await request('get', '/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();

    // If edit mode, fetch post data
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const data = await request('get', `/api/posts/${id}`);
          setFormData({
            title: data.title,
            content: data.content,
            category: data.category?._id || data.category, // Handle populated or unpopulated
            featuredImage: data.featuredImage || '',
          });
        } catch (err) {
          console.error('Failed to fetch post', err);
        }
      };
      fetchPost();
    }
  }, [id, isEditMode, request]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await request('put', `/api/posts/${id}`, formData);
      } else {
        await request('post', '/api/posts', formData);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  return (
    <div className="post-form-container">
      <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Featured Image URL</label>
          <input
            type="text"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
