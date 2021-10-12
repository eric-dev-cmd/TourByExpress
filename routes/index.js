const toursRouter = require('./toursRoutes');
const usersRouter = require('./usersRoutes');
const reviewsRouter = require('./reviewsRoutes');

function route(app) {
  app.use('/api/v1/tours', toursRouter);
    app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/reviews', reviewsRouter);
    
}
module.exports = route;
