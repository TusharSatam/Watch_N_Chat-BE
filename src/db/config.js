const mongoose = require('mongoose')
const { logger } = require('../middleware/winston.middleware')

require('dotenv').config()
const dburl ="mongodb+srv://tsatam91:watchandchat@watchandchat.xc7af1a.mongodb.net/?retryWrites=true&w=majority&appName=watchandchat"

exports.dbConnection = async () => {
  try {
    await mongoose.connect(dburl)
    logger.info('db connection established')
  } catch (error) {
    logger.error('db connection error')
  }
}