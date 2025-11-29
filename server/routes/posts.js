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
router.put(
  '/:id',
  [
    body('title', 'Title is required').optional().not().isEmpty(),
    body('content', 'Content is required').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, featuredImage } = req.body;

    // Build post object
    const postFields = {};
    if (title) postFields.title = title;
    if (content) postFields.content = content;
    if (category) postFields.category = category;
    if (featuredImage) postFields.featuredImage = featuredImage;

    try {
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      // Update
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: postFields },
        { new: true }
      ).populate('category');

      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.deleteOne();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;