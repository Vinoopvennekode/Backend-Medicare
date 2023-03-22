import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_CONNECT_online).then(() => {
    console.log('mongdb connected');
  })

    .catch((error) => {
      console.log(error.message);
      process.exit();
    });
};

export default connectDB;
