import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <h1>{post.title}</h1>
          <p className="post-category">Category: {post.category?.name || 'Uncategorized'}</p>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </article>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
};

export default SinglePost;