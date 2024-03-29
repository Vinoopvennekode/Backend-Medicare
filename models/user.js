import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  block: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Array,
    default: [],
  },
  seenNotifications: {
    type: Array,
    default: [],
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
