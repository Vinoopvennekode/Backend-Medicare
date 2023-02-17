import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
});

const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;
