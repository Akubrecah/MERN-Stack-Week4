import React from 'react';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Explore the <span className="text-gradient">Future</span> of Tech
        </h1>
        <p className="hero-subtitle">
          Discover insightful articles on development, design, and the latest trends in technology.
        </p>
        <a href="#latest-posts" className="btn btn-primary hero-btn">Start Reading</a>
      </div>
      <div className="hero-background"></div>
    </div>
  );
};

export default Hero;
