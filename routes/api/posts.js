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
    const post = await Post.deleteOne({ _id: req.params.post_id });
    if (post.deletedCount !== 1)
      return res.status(500).json({ msg: 'invalid credentials' });

    return res.json({ msg: 'post deleted' });
  } catch (err) {
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
    if (!post) return res.status(400).json({ msg: 'invalid credentials' });
    res.json(post);
  } catch (err) {
    console.log(err);
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route  GET api/posts
// @desc   get all the posts
// @access public

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({});

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
