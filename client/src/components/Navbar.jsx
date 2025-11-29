import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          MERN<span className="logo-accent">Blog</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/posts/new" className="btn btn-primary nav-btn">Write a Post</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
