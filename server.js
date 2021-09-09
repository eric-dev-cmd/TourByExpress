const dotenv = require('dotenv')
const port = 4000 || process.env.PORT
dotenv.config({
    path: './config.env'
})

const app = require('./app')
/**
 * TODO: Connect DB
 */
const db = require('./config/db/index')
db.connect()

/**
 * TODO: PORT
 */

app.listen(port, () => {
    console.log(`App running on ${port}...`)
})