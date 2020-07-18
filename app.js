const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//to get cookies
app.use(cookieParser());
// to allow cross origin domains
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://createandshare.netlify.app']
  })
);
app.options('*', cors());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use(express.static(path.resolve('./public')));

//test middleware for development
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
