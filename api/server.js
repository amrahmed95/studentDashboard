require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');
const PORT = process.env.PORT;
const db = require('./src/models');
const { connectToDB } = require('./src/config/database');

connectToDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});

