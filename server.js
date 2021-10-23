const dotenv = require('dotenv');
const port = 5000 || process.env.PORT;
dotenv.config({
  path: './config.env',
});

const app = require('./app');
/**
 * TODO: Connect DB
 */
const db = require('./config/db/index');
db.connect();

/**
 * TODO: PORT
 */

const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 😮');
  server.close(() => {
    process.exit(1);
  });
});
