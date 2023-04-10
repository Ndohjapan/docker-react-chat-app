const config = require('config');
const mongoose = require('mongoose');

const dbConfig = config.get('database');

const database = async () => {
  try {
    await mongoose.connect(dbConfig.url, {
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      useNewUrlParser: true,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('connected to db....');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = database;
