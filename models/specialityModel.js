import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  deptImg: {
    type: String,
  },
  status: {
    type: String,
    default:'Active'
  },
});

const specialityModel = mongoose.model("speciality", specialitySchema);

export default specialityModel;
