const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'a post must belong to a certain user']
  },
  content: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
