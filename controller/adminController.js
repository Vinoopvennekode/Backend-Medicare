import AdminModel from "../models/adminModel.js";
import UserModel from "../models/user.js";
import specialityModel from "../models/specialityModel.js";
import DocterModel from "../models/DocterModel.js";
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
    console.log('okkkkk');
    const { name, description ,deptImg} = req.body;
    if (name && description&&deptImg) {
      const regex = new RegExp(name, "i");
      const speciality = await specialityModel.find({
        name: { $regex: regex },
      });
      console.log(speciality);
      if (speciality.length === 0) {
        const newSpeciality = new specialityModel({
          name: name,
          description: description,
          deptImg:deptImg
        });
        await newSpeciality.save();
        let message = "succuss";
        res.json({ message,success:true });
      } else {
        let message = "speciality already exist";
        res.json({ message });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getSpeciality = async (req, res) => {
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

const viewSpeciality = async (req, res) => {
  try {
    console.log('ok55555kkkkk');
    console.log(req.body);

    const department = await specialityModel.findById(req.body.id);
    if (department) {
      res.json({ department, message: "succuss" });
    } else {
      res.json({ message: "departmet failed" });
    }
  } catch (error) {
    console.log(error);
  }
};


const blockUser = async (req, res) => {
  try {
    console.log(req.body);
    const client = await UserModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });
    console.log(client.block);
    if (client) {
      res
        .status(201)
        .send({ message: `${client.fName} is blocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${client.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const unblockUser = async (req, res) => {
  try {
    console.log(req.body);
    const client = await UserModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });
    console.log(client.block);
    if (client) {
      res
        .status(201)
        .send({ message: `${client.fName} is unblocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${client.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctor = await DocterModel.find();
    if (doctor) {
      res.json({ doctor });
    } else {
      let messages = "doctors not exist";
    }
    console.log(doctor);
  } catch (error) {
    console.log(error);
  }
};

const blockDoctor = async (req, res) => {
  try {
    console.log("okkkkkkkkkkkkkkkk");
    console.log("hii" + req.body);
    const doctor = await DocterModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });
    console.log("hai" + doctor);
    if (doctor) {
      res
        .status(201)
        .send({ message: `${doctor.fName} is blocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${doctor.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const unblockDoctor = async (req, res) => {
  try {
    console.log(req.body);
    const doctor = await DocterModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });
    console.log(doctor.block);
    if (doctor) {
      res
        .status(201)
        .send({ message: `${doctor.fName} is unblocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${doctor.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const DoctorPending = async (req, res) => {
  try {
    const doctor = await DocterModel.find({ status: false });
    if (doctor) {
      res.json({ doctor });
    } else {
      let messages = "doctors not exist";
    }
    console.log(doctor);
  } catch (error) {
    console.log(error);
  }
};

const approveDoctor = async (req, res) => {
  try {
    console.log(req.body);
    const doctor = await DocterModel.findByIdAndUpdate(req.body.id, {
      status: true,
    });
    console.log(doctor);
    if (doctor) {
      res.status(201).send({ success: true });
    } else {
      return res.status(200).send({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
};
export default {
  AdminLogin,
  isAdmin,
  getusers,
  speciality,
  getSpeciality,
  blockUser,
  unblockUser,
  getDoctors,
  blockDoctor,
  unblockDoctor,
  DoctorPending,
  approveDoctor,
  viewSpeciality,
};
