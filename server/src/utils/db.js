import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = 'mongodb+srv://fahad:Developer688123@fahad.te8x1.mongodb.net/';
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'quotes_app' });
  console.log('✓ MongoDB connected');
};

export default connectDB;
