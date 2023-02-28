import DocterModel from "../models/DocterModel.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";

const docterSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    if (firstName && lastName && email && password) {
      const docter = await DocterModel.find({ email: email });
      console.log(docter);

      if (docter.length === 0) {
        const token = jwt.generateToken(docter._id);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newDocter = new DocterModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          doctorStatus: "register",
        });
        await newDocter.save().then((doctor) => {
          const token = jwt.generateToken(doctor._id);
          res.json({
            token,
            docterId: doctor._id,
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

const docterRegister = async (req, res) => {
  const {
    gender,
    phoneNumber,
    department,
    experience,
    location,
    address,
    docterId,
    doctorimg,
    certificate,
  } = req.body;
  console.log(req.body);
  try {
    if (
      gender &&
      phoneNumber &&
      department &&
      experience &&
      location &&
      address &&
      certificate &&
      doctorimg &&
      docterId
    ) {
      const docter = await DocterModel.findByIdAndUpdate(docterId, {
        $set: {
          gender,
          phoneNumber,
          department,
          experience,
          address,
          location,
          doctorimg,
          certificate,
          status: false,
          doctorStatus: "pending",
        },
      });
      if (docter) {
        let message = "success";
        res.json({ message });
      }
    } else {
      let message = "fill all column";
      res.json({ message });
    }
  } catch (error) {
    json({ error });
  }
};

const docterLogin = async (req, res) => {
  let docterLogin = {
    Status: false,
    message: null,
    token: null,
    name: null,
    id:null,
  };
  try {
    const docterDetails = req.body;
    console.log(req.body);
    const findDocter = await DocterModel.findOne({
      email: docterDetails.email,
    });
    console.log(findDocter);
    if (findDocter) {
      console.log(docterDetails.password, findDocter.password);
      const isMatch = await bcrypt.compare(
        docterDetails.password,
        findDocter.password
      );
      if (isMatch === true) {
        const token = jwt.generateToken(findDocter._id);
        console.log(token);
        docterLogin.message = "You are logged";
        docterLogin.Status = true;
        docterLogin.token = token;
        docterLogin.name = findDocter.firstName;
        docterLogin.id = findDocter._id
        res.send({ docterLogin });
      } else {
        docterLogin.message = " Password is wrong";
        docterLogin.Status = false;
        res.send({ docterLogin });
      }
    } else {
      docterLogin.message = "your Email wrong";
      docterLogin.Status = false;
      res.send({ docterLogin });
    }
  } catch (error) {
    res.json({ error });
  }
};

const StatusChecking = async (req, res) => {
  try {
    console.log(req.query);
    const doctor = await DocterModel.findById(req.query.id);
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
    res.status(201).send({ doctorStatus, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `checkDoctorStatus controller ${error.message}`,
    });
  }
};

export default { docterSignup, docterRegister, docterLogin, StatusChecking };