const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
const route = require('./routes/index');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');

/**
 * TODO: MIDDLEWARE
 */
// app.use(express.urlencoded({
//     extended: true
// }))

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('HEADERS: ', req.headers);
  next();
});
/**
 * TODO ROUTES
 */
route(app);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'Failure v'
  // err.statusCode = 404
  // next(err)
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});
app.use(globalErrorHandler);

module.exports = app;
