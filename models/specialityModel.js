import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

const specialityModel = mongoose.model("speciality", specialitySchema);

export default specialityModel;
