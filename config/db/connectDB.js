const mongoose = require('mongoose');
const MONGO_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URL_PROD
    : process.env.MONGODB_URL_DEV;
const connectDB = async () => {
    try {
      const connect = await mongoose.connect(MONGO_URL);
      console.log(`mongodb is connected ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

};
module.exports = connectDB;
