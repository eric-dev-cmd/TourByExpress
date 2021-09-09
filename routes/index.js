const toursRouter = require('./toursRoutes')
const usersRouter = require('./usersRoutes')

function route(app) {
    app.use('/api/v1/tours', toursRouter);
    app.use('/api/v1/users', usersRouter);
}
module.exports = route