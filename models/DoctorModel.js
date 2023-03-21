import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
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
  address:{
    type:String
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
  fees: {
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
  rejectReason: {
    type: String,
  },
  leaveDays: [
    {
      start: { type: String },
      end: { type: String },
    },
  ],
});

const DoctorModel = mongoose.model("Docter", DoctorSchema);

export default DoctorModel;
