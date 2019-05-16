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

      const { title, text, name, avatar } = req.body;

      const postFields = {};

      postFields.user = req.user.id;
      postFields.title = title;
      postFields.text = text;
      postFields.name = name;
      postFields.avatar = avatar;

      const newPost = new Post(postFields);
      await newPost.save();

      res.json({ newPost });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
