import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/bookdb';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Running in development mode with limited functionality. Database operations will fail.');
    // Do not exit the process to allow testing other features
    // process.exit(1);
  }
};

export default connectDB; 