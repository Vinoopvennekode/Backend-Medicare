import UserModel from "../models/user.js";
import specialityModel from "../models/specialityModel.js";
import {
  AppoinmentModel,
  userAppoinmentModel,
} from "../models/AppoinmentModel.js";

import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";
import DocterModel from "../models/DocterModel.js";
import { sendsms, verifysms } from "../config/otpvalidation.js";



const userSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    if (name && email && phoneNumber && password) {
      const user = await UserModel.find({ email: email });
      const phone = await UserModel.find({ phone: phoneNumber });
      if (user.length) {
        res.json({ status: "failed", message: "user already exist" });
      } else if (phone) {
        res.json({ status: "failed", message: "Phone Number already exist" });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
          name: name,
          email: email,
          password: hashedPassword,
          phone: phoneNumber,
        });
        await newUser.save();
        res.json({ status: "success", message: "signup success" }).Status(200);
      }
    } else {
      res.json({ status: "failed", message: "fill all column" });
    }
  } catch (error) {
    console.log(error);
  }
};

const userLogin = async (req, res) => {
  let userLogin = {
    Status: false,
    message: null,
    token: null,
    name: null,
  };
  try {
    const userDetails = req.body;
    console.log(req.body);
    const findUser = await UserModel.findOne({ email: userDetails.email });
    console.log(findUser);
    if (findUser) {
      const isMatch = await bcrypt.compare(
        userDetails.password,
        findUser.password
      );
      if (isMatch === true) {
        const token = jwt.generateToken(findUser._id);
        console.log(token);
        userLogin.message = "You are logged";
        userLogin.Status = true;
        userLogin.token = token;
        userLogin.name = findUser.name;
        userLogin.id = findUser._id;
        res.send({ userLogin });
      } else {
        userLogin.message = " Password is wrong";
        userLogin.Status = false;
        res.send({ userLogin });
      }
    } else {
      userLogin.message = "your Email wrong";
      userLogin.Status = false;
      res.send({ userLogin });
    }
  } catch (error) {
    console.log(error);
  }
};

const departments = async (req, res) => {
  try {
    const departments = await specialityModel.find();
    if (departments) {
      res.json({ departments });
    } else {
      let messages = "users not exist";
    }
    console.log(departments);
  } catch (error) {
    console.log(error);
  }
};

const viewAppoinment = async (req, res) => {
  try {
    console.log(req.query);
    const app = await AppoinmentModel.findOne({ doctor: req.query.id });
    const exist = app.appoinments.find((el) => el.day === req.query.day);
    if (exist) {
      const time = exist.time;
      // console.log(time, "==================");
      res.json({ time: time });
    } else {
      res.json({ time: [], message: "time not available" });
    }
  } catch (error) {
    res.json({ error });
  }
};

const findDoctror = async (req, res) => {
  try {
    // console.log(req.query.id, "0000000000000000000000");
    const doctor = await DocterModel.findOne({ _id: req.query.id });
    // console.log(doctor, "dddddddddddddddd");
    res.json({ doctor });
  } catch (error) {
    res.json({ error });
  }
};

const postAppointmnet = async (req, res) => {
  try {
    // console.log(req.body);
    const { doctor, user, age, symptoms, date, time } = req.body;
    console.log(req.body, "+_+_+_+_+_+_+_+_");
    if (doctor && user && age && symptoms && date && time) {
      const exist = await userAppoinmentModel.find({
        doctor: doctor,
        user: user,
        date: date,
      });
      console.log(exist);
      if (!exist.length) {
        const newAppoinment = new userAppoinmentModel({
          doctor: doctor,
          user: user,
          age: age,
          symptoms: symptoms,
          date,
          timeStart: time.start,
          timeEnd: time.end,
        });
        newAppoinment.save();
        res.json(newAppoinment);
      } else {
        res.json({ message: "already send a request" });
      }
    } else {
      res.json({ message: "fill all column" });
    }
  } catch (error) {
    res.json(error);
  }
};

export default {
  userSignup,
  userLogin,
  departments,
  viewAppoinment,
  findDoctror,
  postAppointmnet,
};
