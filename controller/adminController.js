import AdminModel from "../models/adminModel.js";
import UserModel from "../models/user.js";
import specialityModel from "../models/specialityModel.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";

const AdminLogin = async (req, res) => {
  try {
    let adminResult = {
      Status: false,
      message: null,
      token: null,
    };

    let adminDetails = req.body;
    if (adminDetails.email && adminDetails.password) {
      const admin = await AdminModel.findOne({ email: adminDetails.email });

      console.log(admin);
      if (admin) {
        const isMatch = await bcrypt.compare(
          adminDetails.password,
          admin.password
        );

        if (isMatch) {
          const token = jwt.generateToken(admin._id);
          adminResult.Status = true;
          adminResult.token = token;
          res.json({ adminResult });
        } else {
          adminResult.message = "Your Password not matched";
          res.json({ adminResult });
        }
      } else {
        adminResult.message = "Your email is wrong";
        res.json({ adminResult });
      }
    } else {
      adminResult.message = "fill all column";
      res.json({ adminResult });
    }
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const adminDetails = await AdminModel.findById(req.adminId);
    adminDetails.auth = true;

    res.json({
      username: adminDetails.name,
      email: adminDetails.email,
      auth: true,
    });
  } catch (error) {
    next(error);
  }
};

const getusers = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users) {
      res.json({ users });
    } else {
      let messages = "users not exist";
    }
    console.log(users);
  } catch (error) {
    console.log(error);
  }
};

const speciality = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (name && description) {
      const regex = new RegExp(name, "i");
      const speciality = await specialityModel.find({
        name: { $regex: regex },
      });
      console.log(speciality);
      if (speciality.length === 0) {
        const newSpeciality = new specialityModel({
          name: name,
          description: description,
        });
        await newSpeciality.save();
        let message = "succuss";
        res.json({ message });
      } else {
        let message = "speciality already exist";
        res.json({ message });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export default { AdminLogin, isAdmin, getusers, speciality };
