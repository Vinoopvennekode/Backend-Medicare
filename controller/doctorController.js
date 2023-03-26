import DoctorModel from "../models/DoctorModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";
import {
  AppoinmentModel,
  userAppoinmentModel,
} from "../models/AppoinmentModel.js";
import moment from "moment";
import UserModel from "../models/user.js";
import { sendsms, verifysms } from "../config/otpvalidation.js";

const doctorSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (firstName && lastName && email && password) {
      const doctor = await DoctorModel.find({ email: email });

      if (doctor.length === 0) {
        const token = jwt.generateToken(doctor._id);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newDoctor = new DoctorModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          doctorStatus: "register",
        });
        await newDoctor.save().then((doctor) => {
          const token = jwt.generateToken(doctor._id);
          res.json({
            token,
            doctorId: doctor._id,
            doctorStatus: doctor.doctorStatus,
            status: "success",
            message: "signup success",
          });
        });
      } else {
        let message = "email already exist";
        res.json({ message });
      }
    } else {
      let message = "fill all column";
      res.json({ message });
    }
  } catch (error) {
    res.json({ error });
  }
};

const doctorRegister = async (req, res) => {
  const {
    gender,
    phoneNumber,
    department,
    experience,
    location,
    fees,
    address,
    doctorId,
    doctorimg,
    certificate,
  } = req.body;

  try {
    if (
      gender &&
      phoneNumber &&
      department &&
      experience &&
      location &&
      fees &&
      address &&
      certificate &&
      doctorimg &&
      doctorId
    ) {
      const docId = doctorId.doctorId;
      const doctor = await DoctorModel.findByIdAndUpdate(docId, {
        $set: {
          gender,
          phoneNumber,
          department,
          experience,
          address,
          location,
          fees,
          doctorimg,
          certificate,
          status: false,
          doctorStatus: "pending",
        },
      });
      if (doctor) {
        let message = "success";
        res.json({ message });
      }
    } else {
      let message = "fill all column";
      res.json({ message });
    }
  } catch (error) {
    res.json({ error });
  }
};

const doctorLogin = async (req, res) => {
  let doctorLogin = {
    Status: false,
    message: null,
    token: null,
    name: null,
    id: null,
  };
  try {
    const doctorDetails = req.body;

    const findDoctor = await DoctorModel.findOne({
      email: doctorDetails.email,
    });

    if (findDoctor) {
      const isMatch = await bcrypt.compare(
        doctorDetails.password,
        findDoctor.password
      );
      if (isMatch === true) {
        const token = jwt.generateToken(findDoctor._id);

        doctorLogin.message = "You are logged";
        doctorLogin.Status = true;
        doctorLogin.token = token;
        doctorLogin.name = findDoctor.firstName;
        doctorLogin.id = findDoctor._id;
        res.send({ doctorLogin });
      } else {
        doctorLogin.message = " Password is wrong";
        doctorLogin.Status = false;
        res.send({ doctorLogin });
      }
    } else {
      doctorLogin.message = "your Email wrong";
      doctorLogin.Status = false;
      res.send({ doctorLogin });
    }
  } catch (error) {
    res.json({ error });
  }
};

const StatusChecking = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.query.id);
    let doctorStatus;
    if (doctor.doctorStatus === "pending") {
      doctorStatus = doctor.doctorStatus;
    }
    if (doctor.doctorStatus === "register") {
      doctorStatus = doctor.doctorStatus;
    }
    if (doctor.doctorStatus === "active") {
      doctorStatus = doctor.doctorStatus;
    }
    if (doctor.doctorStatus === "reject") {
      doctorStatus = doctor.doctorStatus;
    }
    res.status(201).send({ doctor, doctorStatus, success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `checkDoctorStatus controller ${error.message}`,
    });
  }
};

const leaveDays = async (req, res) => {
  try {
    const { start, end } = req.body.data;
    const { id } = req.body.id;

    const doc = await DoctorModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: { availableDay: { day: "mon", start: start, end: end } },
      }
    );
  } catch (error) {
    res.json(error);
  }
};

const timeSlots = async (req, res) => {
  try {
    const app = await AppoinmentModel.findOne({ doctor: req.query.id });
    const exist = app.appoinments.find((el) => el.day === req.query.day);
    if (exist) {
      const time = exist.time;

      res.json({ time });
    } else {
      res.json({ time: [], message: "time not available" });
    }
  } catch (error) {
    res.json({ error });
  }
};

const getAppoinments = async (req, res) => {
  try {
    const { id, date, timeStart } = req.body;
    const dat = moment(date).format("MMM Do YYYY");
    console.log(dat);
    console.log(req.body,'boody');
    const appoinments = await userAppoinmentModel
      .find({
        doctor: id,
        date: dat,
        timeStart: timeStart,
      })
      .populate("user");
      console.log(appoinments);
    res.json({ appoinments });
  } catch (error) {
    res.json({ error });
  }
};

const allotedTime = async (req, res) => {
  try {
    const { date, doctorId, userId, id, allotedTime } = req.body;
    const day = moment(date).format("MMM Do YY");
    const doctor = await DoctorModel.findById(doctorId);
    const editAlloted = await userAppoinmentModel.findByIdAndUpdate(id, {
      status: "approved",
      allotedTime: allotedTime,
      fee: doctor.fees,
    });

    const user = await UserModel.findById(userId);

    const notifications = user.notifications;
    notifications.push({
      type: "ApprovedAppoinment",
      message: `${doctor.firstName} ${doctor.lastName} has Approved your booking on ${day} at ${allotedTime} `,
      fee: doctor.fees,
      id: id,
    });
    const usereee = await UserModel.findByIdAndUpdate(userId, {
      notifications,
    });

    res.json({ message: "done" });
  } catch (error) {
    res.json(error);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const deleteAccount = await DoctorModel.findByIdAndDelete({
        _id: id,
      }).then((res) => {});

      res.json({ success: true, message: "account deleted from database" });
    } else {
      res.json({ message: "id not found" });
    }
  } catch (error) {
    res.json({ error });
  }
};
const getProfile = async (req, res) => {
  const id = req.body.data;

  const doctor = await DoctorModel.findOne({ _id: id });

  res.json({ doctor });
};

const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    experience,
    location,
    fees,
    address,
    doctorId,
    doctorimg,
  } = req.body;

  try {
    const doctor = await DoctorModel.findByIdAndUpdate(doctorId, {
      $set: {
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        experience,
        address,
        location,
        fees,
        doctorimg,
      },
    });
    if (doctor) {
      let message = "success";
      res.json({ message });
    }
  } catch (error) {
    res.json({ error });
  }
};

const appoinmentHistory = async (req, res) => {
  try {
    const { date, id } = req.body;
    const dat = moment(date).format("MMM Do YYYY");

    const appoinments = await userAppoinmentModel
      .find({
        doctor: id,
        date: dat,
        status: "checked",
      })
      .populate("user");

    res.json({ appoinments });
  } catch (error) {
    res.json({ error });
  }
};

const checked = async (req, res) => {
  try {
    const id = req.body.data;
    const checked = await userAppoinmentModel.findByIdAndUpdate(id, {
      status: "checked",
    });
    res.json({ message: "checked" });
  } catch (error) {
    res.json({ error });
  }
};

const NumberCheck = async (req, res, next) => {
  try {
    console.log(req.body);
    const { phoneNumber } = req.body;
    const data = await DoctorModel.find({ phoneNumber: phoneNumber });
    if (data.length) {
      res.json({ status: true });
      sendsms(phoneNumber);
    } else {
      res.json({ status: "failed", message: "Phone Number not Exisit" });
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
      await DoctorModel.findOneAndUpdate(
        { phoneNumber: phoneNumber },
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

const cancelAppoinment = async (req, res) => {
  try {
    console.log(req.body, "body");
    const id = req.body.data;
    const cancel = await userAppoinmentModel.findByIdAndUpdate(id, {
      status: "canceled",
    });
    res.json({ status: "canceled" });
    console.log(cancel);
  } catch (error) {
    res.json({ error });
  }
};

const dashboard = async (req, res) => {
  try {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    console.log(req.body);
    const doctorId = req.body.data;
    const totalAppoinments = await userAppoinmentModel
      .find({
        doctor: doctorId,
      })
      .count();

    const pending = await userAppoinmentModel
      .find({ doctor: doctorId, status: "pending" })
      .count();

    const canceled = await userAppoinmentModel
      .find({
        doctor: doctorId,
        status: "canceled",
      })
      .count();

    const checked = await userAppoinmentModel
      .find({ doctor: doctorId, status: "checked" })
      .count();

       const salesReport = await userAppoinmentModel.aggregate([
      {
        $match: {
          doctor: mongoose.Types.ObjectId(doctorId),
          status: "checked",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: {
            $sum: "$fee",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          count:1,
          totalSales: 1,
        },
      },
    ]);
    const newSalesReport = salesReport.map((el) => {
      let newEl = { ...el };
      newEl.month = months[newEl.month - 1];
      return newEl;
    });

    res.json({ totalAppoinments, pending, canceled, checked ,salesReport:newSalesReport});
  } catch (error) {
    res.json({ error });
  }
};
export default {
  doctorSignup,
  doctorRegister,
  doctorLogin,
  StatusChecking,
  leaveDays,
  getAppoinments,
  timeSlots,
  allotedTime,
  deleteAccount,
  getProfile,
  updateProfile,
  appoinmentHistory,
  checked,
  cancelAppoinment,
  setNewPassword,
  forgotOtpVerify,
  NumberCheck,
  dashboard,
};
