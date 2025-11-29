import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete post', err);
        alert('Failed to delete post');
      }
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Error fetching post. It might not exist or there was a server issue.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // Re-run effect if post ID changes

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
  return (
    <div className="single-post-page">
      {post.featuredImage && (
        <div className="post-hero-image" style={{ backgroundImage: `url(${post.featuredImage})` }}>
          <div className="post-hero-overlay"></div>
        </div>
      )}
      
      <div className="single-post-container">
        <Link to="/" className="back-link">&larr; Back to Articles</Link>
        
        <article className="post-article">
          <header className="article-header">
            <span className="post-category-badge">{post.category?.name || 'Uncategorized'}</span>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
              {/* Add author if available */}
            </div>
            
            <div className="post-actions">
              <Link to={`/posts/${post._id}/edit`} className="btn btn-secondary btn-sm">Edit Post</Link>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </header>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </article>
      </div>
    </div>
  );
};

export default SinglePost;