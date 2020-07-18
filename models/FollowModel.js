const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There must be a follower']
  },
  followee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There must be a followee']
  }
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
