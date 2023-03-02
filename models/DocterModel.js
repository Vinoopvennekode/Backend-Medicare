import mongoose from "mongoose";

const DocterSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  doctorimg: {
    type: String,
  },
  certificate: {
    type: String,
  },
  department: {
    type: String,
  },
  experience: {
    type: String,
  },
  location: {
    type: String,
  },
  availableDay: [
    {
      day: {
        type: String,
      },
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },
  ],
  status: {
    type: Boolean,
    default: false,
  },
  doctorStatus: {
    type: String,
  },
  block: {
    type: Boolean,
    default: false,
  },
  leaveDays: [
    {
      start: { type: String },
      end: { type: String },
    },
  ],
});

const DocterModel = mongoose.model("Docter", DocterSchema);

export default DocterModel;
