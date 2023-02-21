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
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newDocter = new DocterModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
        });
        await newDocter.save();
        console.log(newDocter);
        res.json({ status: "success", message: "signup success" });
      } else {
        let message = "email already exist";
        res.json({ message });
      }
    } else {
      let message = "fill all column";
      res.json({ message });
    }
  } catch (error) {
    console.log(error);
  }
};

const docterRegister = async (req, res) => {
  const { gender, phone, speciality, experience, location, address, docterId } =
    req.body;

  try {
    if (gender && phone && speciality && experience && location && address) {
      const docter = await DocterModel.findByIdAndUpdate(docterId, {
        $set: {
          gender,
          phone,
          speciality,
          experience,
          address,
          location,
          status: false,
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
    console.log(error);
  }
};

const docterLogin = async (req, res) => {
  let docterLogin = {
    Status: false,
    message: null,
    token: null,
    name: null,
  };
  try {
    const docterDetails = req.body;
    console.log(req.body);
    const findDocter = await DocterModel.findOne({
      email: docterDetails.email,
    });
    console.log(findDocter);
    if (findDocter) {
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
    console.log(error);
  }
};

export default { docterSignup, docterRegister, docterLogin };
