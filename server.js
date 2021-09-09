const dotenv = require('dotenv')

dotenv.config({
    path: './config.env'
})

const app = require('./app')
const db = require('./config/db/index')
const Tour = require('./models/Tour')
db.connect()

const test = new Tour({
    name: "The Axin",
    // price: 2445,
    rating: 4.6
})
test.save().then(data => console.log(data)).catch(err => console.log('ERROR 😥', err))
const port = 4000 || process.env.PORT

app.listen(port, () => {
    console.log(`App running on ${port}...`)
})