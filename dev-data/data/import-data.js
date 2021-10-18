const db = require('../../config/db/index');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/Tour');
const Review = require('./../../models/Review');
const User = require('./../../models/User');
dotenv.config({ path: './config.env' });
db.connect();
/**
 * TODO: READ FILE JSON
 * node .\dev-data\data\import-data.js --import
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

/**
 * TODO: IMPORT DATA TO DB
 */
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded 🤩');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted 🤩');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
// node .\dev-data\data\import-data.js --delete
