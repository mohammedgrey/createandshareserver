const multer = require('multer');
const sharp = require('sharp');
const Post = require('./../models/postModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const Follow = require('../models/FollowModel');

exports.getMePosts = async (req, res, next) => {
  //////////////////
  const userID = req.user._id;
  if (!userID) return next(new AppError('authentication failed', 401));
  /////////////////////////////////////////
  const features = new APIFeatures(
    Post.find({ user: userID }).populate(
      'user',
      '-birthdate -__v -passwordChangedAt -email'
    ),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const posts = await features.query;
  ///////////////////////////////
  // const posts = await Post.find({ user: userID }).populate(
  //   'user',
  //   '-birthdate -__v -passwordChangedAt -email'
  // );

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      posts
    }
  });
};

exports.addPost = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const postContent = req.body.content;
  if (!postContent && !req.file)
    return next(
      new AppError('please provide at least content for the post', 400)
    );
  if (!userID) return next(new AppError('authentication failed', 401));

  const filteredBody = {
    user: userID
  };
  if (postContent) filteredBody.content = postContent;
  if (req.file) filteredBody.image = req.file.filename;
  if (req.body.createdAt) filteredBody.createdAt = req.body.createdAt;
  const newPost = await Post.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});
exports.getPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Post.find().populate('user', '-birthdate -__v -passwordChangedAt -email'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      posts
    }
  });
});
exports.getPost = catchAsync(async (req, res, next) => {});
exports.updatePost = catchAsync(async (req, res, next) => {});
exports.deletePost = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  if (!userID) return next(new AppError('authentication failed', 401));

  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//to add an image to a new post
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadPostImage = upload.single('photo');

exports.resizePostImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/posts/${req.file.filename}`);

  next();
});
//end of to add an image to a new post

exports.getFollowPosts = async (req, res, next) => {
  const userID = req.user._id;
  if (!userID) return next(new AppError('authentication failed', 401));

  const following = await Follow.find({ follower: userID });
  const listOfIDs = following.map(e => e.followee);
  console.log(listOfIDs);
  const features = new APIFeatures(
    Post.find({ user: { $in: listOfIDs } }).populate(
      'user',
      '-birthdate -__v -passwordChangedAt -email'
    ),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      posts
    }
  });
};

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const userID = req.params.id;
  const features = new APIFeatures(
    Post.find({ user: userID }).populate(
      'user',
      '-birthdate -__v -passwordChangedAt -email -bio'
    ),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      posts
    }
  });
});
