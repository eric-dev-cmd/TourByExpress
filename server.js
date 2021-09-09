const dotenv = require('dotenv')

dotenv.config({
    path: './config.env'
})

const app = require('./app')
/**
 * TODO: Connect DB
 */
const db = require('./config/db/index')
const Tour = require('./models/Tour')
db.connect()

/**
 * TODO: PORT
 */
const port = 4000 || process.env.PORT

app.listen(port, () => {
    console.log(`App running on ${port}...`)
})