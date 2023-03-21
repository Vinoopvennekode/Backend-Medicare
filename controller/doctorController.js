import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";
import {
  AppoinmentModel,
  userAppoinmentModel,
} from "../models/AppoinmentModel.js";
import moment from "moment";
import UserModel from "../models/user.js";

const doctorSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    if (firstName && lastName && email && password) {
      const doctor = await DoctorModel.find({ email: email });
      console.log(doctor);

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
    console.log(error);
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
    console.log(req.body);
    const findDoctor = await DoctorModel.findOne({
      email: doctorDetails.email,
    });
    console.log(findDoctor);
    if (findDoctor) {
      const isMatch = await bcrypt.compare(
        doctorDetails.password,
        findDoctor.password
      );
      if (isMatch === true) {
        const token = jwt.generateToken(findDoctor._id);
        console.log(token, "tooeekekekenn");
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
      console.log("email wrong");
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
    console.log(req.query);
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
    console.log(error);
    res.status(500).send({
      success: false,
      message: `checkDoctorStatus controller ${error.message}`,
    });
  }
};

const leaveDays = async (req, res) => {
  try {
    console.log(req.body);

    const { start, end } = req.body.data;
    const { id } = req.body.id;
    console.log("1");

    const doc = await DoctorModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: { availableDay: { day: "mon", start: start, end: end } },
      }
    );
    console.log(doc, "hellooo");
    console.log("2");
  } catch (error) {
    res.json(error);
  }
};

const timeSlots = async (req, res) => {
  try {
    console.log("++++++////", req.query);
    const app = await AppoinmentModel.findOne({ doctor: req.query.id });
    const exist = app.appoinments.find((el) => el.day === req.query.day);
    if (exist) {
      const time = exist.time;
      console.log(time);
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
    console.log(id, dat, timeStart);
    const appoinments = await userAppoinmentModel
      .find({
        doctor: id,
        date: dat,
        timeStart: timeStart,
      })
      .populate("user");
    res.json({ appoinments });
  } catch (error) {
    res.json({ error });
  }
};

const allotedTime = async (req, res) => {
  try {
    const { date, doctorId, userId, id, allotedTime } = req.body;
    const day = moment(date).format("MMM Do YY");
    const editAlloted = await userAppoinmentModel.findByIdAndUpdate(id, {
      status: "approved",
      allotedTime: allotedTime,
    });
    const doctor = await DoctorModel.findById(doctorId);

    const user = await UserModel.findById(userId);

    const notifications = user.notifications;
    notifications.push({
      type: "ApprovedAppoinment",
      message: `${doctor.firstName} ${doctor.lastName} has Approved your booking on ${day} at ${allotedTime} `,
    });
    const usereee = await UserModel.findByIdAndUpdate(userId, {
      notifications,
    });
    console.log(usereee);
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
      }).then((res) => {
        console.log(res);
      });

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
  console.log(id, "isddddd");
  const doctor = await DoctorModel.findOne({ _id: id });
  console.log(doctor);
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
  console.log(req.body, "req booodydyyyyyy");
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
    console.log(error);
    res.json({ error });
  }
};

const appoinmentHistory = async (req, res) => {
  try {
    const { date, id } = req.body;
    const dat = moment(date).format("MMM Do YYYY");

    console.log(req.body);
    const appoinments = await userAppoinmentModel
      .find({
        doctor: id,
        date: dat,
        status: "checked",
      })
      .populate("user");

    res.json({ appoinments });
  } catch (error) {
    res.json({error})
  }
};

const checked = async (req, res) => {
  try {
    console.log(req.body)
    const id=req.body.data
    const checked = await userAppoinmentModel.findByIdAndUpdate(id, {
      status: "checked",
    });
    res.json({message:'checked'})
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
};
