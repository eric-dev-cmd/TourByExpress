const db = require('../../config/db/index')
const Tour = require('./../../models/Tour')
const fs = require('fs')
db.connect()
/**
 * TODO: READ FILE JSON
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))
/**
 * TODO: IMPORT DATA TO DB
 */
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log("Data successfully loaded 🤩")
        process.exit()

    } catch (err) {
        console.log(err)

    }
}
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Data successfully deleted 🤩")
        process.exit()

    } catch (err) {
        console.log(err)
    }
}
if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv)