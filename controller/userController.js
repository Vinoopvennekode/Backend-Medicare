import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";

const userSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    if (name && email && phoneNumber && password) {
      const user = await UserModel.find({ email: email });
      console.log(user);
      if (user.length === 0) {
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
      } else {
        res.json({ status: "failed", message: "user already exist" });
        console.log("user already exist");
      }
    } else {
      res.json({ status: "failed", message: "fill all column" });
      console.log("fill all column");
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

export default { userSignup, userLogin };
