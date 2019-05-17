const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Post = require('../../models/Post');
const User = require('../../models/User');
const gravatar = require('gravatar');

// @route  POST api/posts
// @desc   create new post
// @access private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'text is required field')
        .not()
        .isEmpty(),
      check('title', 'title is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ msg: 'invalid credentials' });

      const { title, text } = req.body;

      const postFields = {};

      const user = await User.findOne({
        _id: req.user.id
      });

      postFields.user = req.user.id;
      postFields.title = title;
      postFields.text = text;
      postFields.name = user.name;
      postFields.avatar = user.avatar;

      const newPost = new Post(postFields);
      await newPost.save();

      res.json({ newPost });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  DELETE api/posts/:post_id
// @desc   delete post by id
// @access private

router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });
    if (post.user.toString() !== req.user.id)
      return res.status(400).json({ msg: 'invalid credentials' });
    const deletePost = await Post.deleteOne({ _id: req.params.post_id });
    if (deletePost.deletedCount !== 1)
      return res.status(401).json({ msg: 'invalid credentials' });

    return res.json({ msg: 'post deleted' });
  } catch (err) {
    if (err.kind === 'ObjectId')
      res.status(400).json({ msg: 'invalid credentials' });
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  GET api/posts/:post_id
// @desc   get post by id
// @access private

router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });
    console.log(post);
    if (!post) return res.status(404).json({ msg: 'post not found' });
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });

    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route  GET api/posts
// @desc   get all the posts
// @access public

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  PUT api/posts/like/:post_id
// @desc   like post by post id
// @access private

router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });
    
    if (!post) return res.status(404).json({ msg: 'post not found' });
    if (post.user.toString() === req.user.id)
      return res.status(400).json({ msg: 'Cant like own posts' });
    const isLiked = post.likes.find(
      like => like.user.toString() === req.user.id
    );
    if (isLiked)
      return res.status(400).json({ msg: 'user has liked this post' });
    const like = { user: req.user.id };
    post.likes.unshift(like);
    await post.save();
    return res.json({ msg: 'like added to post' });
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
