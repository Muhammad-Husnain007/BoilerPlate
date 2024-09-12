import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const Connection = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
    console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
  }
};

export default Connection;


