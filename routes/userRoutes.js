const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/loggedin', authController.isLoggedIn);
router.get('/', userController.getAllUsers);
router.get('/me', authController.protect, userController.getMe);
router.patch(
  '/me/photo',
  authController.protect,
  userController.uploadPhoto,
  userController.resizeUserPhoto,
  userController.changeMyPhoto
);

router.patch('/me/update', authController.protect, userController.updateMe);
router.patch(
  '/me/updatepassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/me/updatebio', authController.protect, userController.updateBio);

router.post('/follow', authController.protect, userController.followUser);

router.get(
  '/me/followers',
  authController.protect,
  userController.getmyfollowers
);
router.get(
  '/me/following',
  authController.protect,
  userController.getmyfollowing
);

router.delete(
  '/follow/:id',
  authController.protect,
  userController.unfollowUser
);

router
  .route('/isfollowed/:id')
  .get(authController.protect, userController.isFollowed);

router
  .route('/:id')
  .get(userController.getUserProfile)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
