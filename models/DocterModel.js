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
  location: {
    type: String,
  },
  availableDay: {
    type: Array,
  },
  status: {
    type: Boolean,
  },
});

const DocterModel = mongoose.model("Docter", DocterSchema);

export default DocterModel;
