const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/me')
  .get(authController.protect, postController.getMePosts)
  .post(
    authController.protect,
    postController.uploadPostImage,
    postController.resizePostImage,
    postController.addPost
  );

router.delete('/:id', authController.protect, postController.deletePost);

router.get('/follow', authController.protect, postController.getFollowPosts);

router.route('/').get(postController.getPosts);

router.get('/users/:id', postController.getUserPosts);

// router
//   .route('/:id')
//   .get(postController.getPost)
//   .patch(postController.updatePost)
//   .delete(postController.deletePost);

module.exports = router;
