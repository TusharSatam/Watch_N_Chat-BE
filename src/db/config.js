const mongoose = require("mongoose");
const { logger } = require("../middleware/winston.middleware");

require("dotenv").config();
const dburl = process.env.Mongo_URL;

exports.dbConnection = async () => {
  try {
    await mongoose.connect(dburl);
    logger.info("db connection established");
  } catch (error) {
    logger.error("db connection error");
  }
};
