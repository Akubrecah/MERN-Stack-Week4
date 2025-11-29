// server/routes/posts.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all blog posts
router.get('/', async (req, res) => {
  try {
    // We use .populate() to get category details and .sort() to get the newest posts first
    const posts = await Post.find().populate('category').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts
// @desc    Create a new blog post
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('content', 'Content is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category } = req.body;

    try {
      const newPost = new Post({
        title,
        content,
        category,
      });

      const post = await newPost.save();
      // We can populate the category right after saving to return the full object
      const populatedPost = await Post.findById(post._id).populate('category');
      res.json(populatedPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// NOTE: PUT and DELETE routes will be added in a subsequent step.

// @route   PUT /api/posts/:id
// @desc    Update an existing blog post
router.put('/:id', (req, res) => {
  // Implementation will go here
  res.send(`Update post ${req.params.id}`);
});

// @route   DELETE /api/posts/:id
// @desc    Delete a blog post
router.delete('/:id', (req, res) => {
  // Implementation will go here
  res.send(`Delete post ${req.params.id}`);
});

module.exports = router;