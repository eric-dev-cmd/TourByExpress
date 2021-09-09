const express = require("express")

const morgan = require("morgan")

const app = express()

const path = require('path');

const route = require('./routes/index')




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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// app.get('/', (req, res) => {
//     res.status(200).json({
//         message: 'Hello from the site home',
//         app: "Natours"
//     })
// })
// app.post('/', (req, res) => {
//     res.status(200).send("Post success")
// })

/**
 * TODO ROUTES
 */
route(app)

module.exports = app;