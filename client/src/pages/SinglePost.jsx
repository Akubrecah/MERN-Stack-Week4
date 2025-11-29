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
    <div className="single-post-container">
      <Link to="/" className="back-link">&larr; Back to Posts</Link>
      {post ? (
        <article>
          <div className="post-header">
            <h1>{post.title}</h1>
            <div className="post-actions">
              <Link to={`/posts/${post._id}/edit`} className="btn btn-secondary">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
          </div>
          <p className="post-category">Category: {post.category?.name || 'Uncategorized'}</p>
          {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="featured-image" />}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </article>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default SinglePost;