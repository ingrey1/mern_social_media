const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },

  title: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
