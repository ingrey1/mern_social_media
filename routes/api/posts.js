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
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ msg: 'invalid credentials' });

      const { text } = req.body;

      const postFields = {};

      const user = await User.findOne({
        _id: req.user.id
      });

      postFields.user = req.user.id;
      postFields.text = text;
      postFields.name = user.name;
      postFields.avatar = user.avatar;

      const newPost = new Post(postFields);
      await newPost.save();

      res.json(newPost);
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
    console.log('made it past 404');

    const isLiked = post.likes.find(
      like => like.user.toString() === req.user.id
    );
    if (isLiked)
      return res.status(400).json({ msg: 'user has liked this post' });
    const like = { user: req.user.id };
    post.likes.unshift(like);
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route  PUT api/posts/unlike/:post_id
// @desc   unlike post by post id
// @access private

router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });
    if (!post) return res.status(404).json({ msg: 'post not fond' });
    console.log('unlike made it past first 404');
    console.log(post);
    const like = post.likes.find(like => like.user.toString() === req.user.id);
    console.log('like exists in unlike', like);
    if (!like) return res.status(404).json('msg: like not found');
    console.log('unlike made it past second 404');
    // remove like
    await Post.updateOne(
      { _id: req.params.post_id },
      { $pull: { likes: { user: req.user.id } } }
    );

    const newPost = await Post.findOne({ _id: req.params.post_id });

    return res.json(newPost.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });
    res.status(500).send('server error');
  }
});

// @route  POST api/posts/comment/:post_id
// @desc   comment on post
// @access private

router.post(
  '/comment/:post_id',
  [
    auth,
    [
      check('text', 'comment has to have text')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors.array());
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // make sure post exists
      const post = await Post.findOne({ _id: req.params.post_id });
      // grab user
      const user = await User.findById(req.user.id);
      if (!post) return res.status(404).json({ msg: 'post not found' });
      // create and populate comment object
      const comment = {};
      comment.name = user.name;
      comment.text = req.body.text;
      comment.user = user._id;
      comment.avatar = user.avatar;
      post.comments.unshift(comment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId')
        return res.status(404).json({ msg: 'post not found' });
      res.status(500).send('server error');
    }
  }
);

// @route  Delete api/posts/comment/:post_id/:comment_id
// @desc   delete comment on post by comment id and post id
// @access private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ msg: 'post not found' });
    let commentIndex;
    for (let i = 0; i < post.comments.length; i++) {
      console.log(post.comments[i]._id.toString());
      if (post.comments[i]._id.toString() === req.params.comment_id) {
        commentIndex = i;
        break;
      }
    }

    if (isNaN(commentIndex))
      return res.status(404).json({ msg: 'comment not found' });
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'resource not found' });
    res.status(500).send('server error');
  }
});

module.exports = router;
