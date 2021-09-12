const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({
    path: './config.env'
})
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)


async function connect() {
    try {
        // await mongoose.connect(DB, {
        await mongoose.connect(process.env.DATABASE_LOCAL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log("Connected Success 😍");
    } catch (error) {
        console.log("Not Successfully 😥");

        // console.log(error);
    }
}
module.exports = {
    connect
}