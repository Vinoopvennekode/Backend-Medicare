import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery',false);
  mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
    // eslint-disable-next-line no-console
    console.log('mongdb connected');
  })

    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error.message);
      process.exit();
    });
};

export default connectDB;
