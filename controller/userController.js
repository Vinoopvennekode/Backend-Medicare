import UserModel from "../models/user.js";
import specialityModel from "../models/specialityModel.js";
import {
  AppoinmentModel,
  userAppoinmentModel,
} from "../models/AppoinmentModel.js";

import bcrypt from "bcrypt";  
import jwt from "../utils/jwt.js";
import DoctorModel from "../models/DoctorModel.js";
import { sendsms, verifysms } from "../config/otpvalidation.js";

const userSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    if (name && email && phoneNumber && password) {
      const user = await UserModel.find({ email: email });
      const phone = await UserModel.find({ phone: phoneNumber });
      if (user.length) {
        res.json({ status: "failed", message: "user already exist" });
      } else if (phone.length) {
        res.json({ status: "failed", message: "Phone Number already exist" });
      } else {
        const token = jwt.generateToken(req.body);

        sendsms(phoneNumber);
        res
          .json({
            userToken: token,
            status: "success",
            message: "otp send successfully",
          })
          .status(200);
      }
    } else {
      res.json({ status: "failed", message: "fill all column" });
    }
  } catch (error) {
    res.json({ error });
  }
};

const otpVerify = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.user.id;

    const otp = req.body.data.otp;
    await verifysms(phoneNumber, otp).then(async (verification_check) => {
      if (verification_check.status == "approved") {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
          name: name,
          email: email,
          password: hashedPassword,
          phone: phoneNumber,
        });
        await newUser.save();
        res.send({ status: "success", message: "signup success" });
      } else {
        res.json({ message: "otp does not match" });
      }
    });
  } catch (error) {
    res.json(error);
  }
};

const NumberCheck = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    console.log(req.body);
    const data = await UserModel.find({ phone: phoneNumber });
    if (data.length === 0) {
      console.log("1");
      res.json({ status: false, message: "Phone Number not Exisit" });
    } else {
      console.log("2");
      res.json({ status: true });
      sendsms(phoneNumber);
    }
  } catch (error) {
    next(error);
  }
};

const setNewPassword = async (req, res, next) => {
  try {
    const { password, confPassword, phoneNumber } = req.body;
    if (password && confPassword && phoneNumber) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password.trim(), salt);
      await UserModel.findOneAndUpdate(
        { phone: phoneNumber },
        {
          $set: { password: hashPassword },
        }
      );
      res.json({ status: true });
    } else {
      res.json({ status: "failed", message: "Please Retry" });
    }
  } catch (error) {
    next(error);
  }
};

const forgotOtpVerify = async (req, res) => {
  try {
    const { otp, phone } = req.body.data;
    await verifysms(phone, otp).then(async (verification_check) => {
      if (verification_check.status == "approved") {
        res.json({ status: true, message: "signup success" });
      } else {
        res.json({ message: "otp does not match" });
      }
    });
  } catch (error) {
    res.json(error);
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
    const findUser = await UserModel.findOne({ email: userDetails.email });
    if (findUser) {
      const isMatch = await bcrypt.compare(
        userDetails.password,
        findUser.password
      );
      if (isMatch === true) {
        const token = jwt.generateToken(findUser._id);

        userLogin.message = "You are logged";
        userLogin.Status = true;
        userLogin.token = token;
        userLogin.name = findUser.name;
        userLogin.id = findUser._id;
        userLogin.block = findUser.block;
        console.log(userLogin);
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
    res.json({ error });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctor = await DoctorModel.find({ status: true });
    if (doctor) {
      res.json({ doctor });
    } else {
      let messages = "doctors not exist";
    }
  } catch (error) {
    res.json({ error });
  }
};
const departments = async (req, res) => {
  try {
    console.log('dep123');
    const departments = await specialityModel.find();
    if (departments) {
      res.json({ departments });
    } else {
      let messages = "users not exist";
    }
  } catch (error) {
    res.json({ error });
  }
};

const viewAppoinment = async (req, res) => {
  try {
    const app = await AppoinmentModel.findOne({ doctor: req.query.id });
    const exist = app.appoinments.find((el) => el.day === req.query.day);
    if (exist) {
      const time = exist.time;

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
    const doctor = await DoctorModel.findOne({ _id: req.query.id });

    res.json({ doctor });
  } catch (error) {
    res.json({ error });
  }
};

const postAppointmnet = async (req, res) => {
  try {
    const { doctor, user, age, symptoms, date, time } = req.body;

    if (doctor && user && age && symptoms && date && time) {
      const exist = await userAppoinmentModel.find({
        doctor: doctor,
        user: user,
        date: date,
      });

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

const getAllNotifications = async (req, res) => {
  try {
    const client = await UserModel.findOne({ _id: req.body.id });

    const clientNotifications = client.notifications;
    const clientSeenNotification = client.seenNotifications;
    res
      .status(200)
      .send({ success: true, clientNotifications, clientSeenNotification });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `getAllNotifications controller ${error.message}`,
    });
  }
};

const notificationMarkAllRead = async (req, res) => {
  try {
    const client = await UserModel.findOne({ _id: req.body.id });

    const seenNotifications = client.seenNotifications;
    const notifications = client.notifications;
    seenNotifications.push(...notifications);
    client.notifications = [];
    client.seenNotifications = notifications;
    const updatedClient = await client.save();

    res
      .status(200)
      .send({ success: true, message: "all notifications marked as read" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `notificationMarkAllRead  controller ${error.message}`,
    });
  }
};

const notificationDeleteAllRead = async (req, res) => {
  try {
    const client = await UserModel.findOne({ _id: req.body.id });
    client.seenNotifications = [];
    const updateClient = await client.save();
    res
      .status(200)
      .send({ success: true, message: "Notifications Deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `notificationDeleteAllRead  controller ${error.message}`,
    });
  }
};

const paymentStatus = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.data;
    const payment = await userAppoinmentModel.findByIdAndUpdate(id, {
      paymentStatus: "done",
    });
    res.json({ message: "status changed" });
  } catch (error) {
    res.json({ error });
  }
};

const getDoctor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const searchData = req.query.searchLocation || "";
    const department = req.query.department || "";
console.log(page,'page');
console.log(searchData,'searchData');
    const query = {
      status: true,
    };
    if (searchData !== "") {
      // query.firstName = { $regex: new RegExp(`^${searchData}.*`, "i") };
      // query.location = { $regex: new RegExp(`^${searchData}.*`, "i") };
      const regex = new RegExp(`^${searchData}.*`, "i");
      query.$or = [
        { location: { $regex: regex } },
        { firstName: { $regex: regex } },
      ];
    }
    if (department === "All") {
      delete query["department"];
    } else if (department !== "") {
      query.department = department;
    }

    const doctors = await DoctorModel.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: doctors,
      currentPage: page,
      totalPages: Math.ceil((await DoctorModel.countDocuments(query)) / limit),
    });
  } catch (error) {
    res.json({ error });
  }
};

const profile = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.data;
    const user = await UserModel.findOne({ _id: id });
    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
};
export default {
  userSignup,
  userLogin,
  departments,
  getDoctors,
  viewAppoinment,
  findDoctror,
  otpVerify,
  NumberCheck,
  postAppointmnet,
  setNewPassword,
  forgotOtpVerify,
  notificationDeleteAllRead,
  getAllNotifications,
  notificationMarkAllRead,
  getDoctor,
  profile,
  paymentStatus,
};
