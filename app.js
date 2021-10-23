const express = require('express');
const morgan = require('morgan');
const app = express();
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const pug = require('pug');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

/**
 * TODO: MIDDLEWARE
 */
// app.use(express.urlencoded({
//     extended: true
// }))
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// Làm sạch dữ liệu chống lại việc đưa vào truy vấn NoSQL
app.use(mongoSanitize());

// Data sanitization against XSS - lam sach du lieu chong XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  // console.log('HEADERS: ', req.headers);

  next();
});

/**
 * TODO ROUTES
 */
// 3) ROUTES
app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'Tour',
  });
});
app.use('/', viewsRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'Failure v'
  // err.statusCode = 404
  // next(err)
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});
app.use(globalErrorHandler);

module.exports = app;
