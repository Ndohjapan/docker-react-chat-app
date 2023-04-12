module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`
  },
};
