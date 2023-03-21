import AdminModel from "../models/adminModel.js";
import UserModel from "../models/user.js";
import specialityModel from "../models/specialityModel.js";
import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";
import {
  AppoinmentModel,
  userAppoinmentModel,
} from "../models/AppoinmentModel.js";

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
    res.json({ error });
  }
};

const getusers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (users) {
      res.json({
        users,
        currentPage: page,
        totalPages: Math.ceil((await UserModel.countDocuments()) / limit),
      });
    } else {
      let messages = "users not exist";
    }
    console.log(users);
  } catch (error) {
    res.json({ error });
  }
};

const speciality = async (req, res) => {
  try {
    console.log("okkkkk");
    const { name, description, deptImg } = req.body;
    if (name && description && deptImg) {
      const regex = new RegExp(name, "i");
      const speciality = await specialityModel.find({
        name: { $regex: regex },
      });
      console.log(speciality);
      if (speciality.length === 0) {
        const newSpeciality = new specialityModel({
          name: name,
          description: description,
          deptImg: deptImg,
        });
        await newSpeciality.save();
        let message = "succuss";
        res.json({ message, status: true });
      } else {
        let message = "speciality already exist";
        res.json({ message });
      }
    }
  } catch (error) {
    res.json({ error });
  }
};

const getSpeciality = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    console.log(page, "paaaageeeeeeee");
    const departments = await specialityModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (departments) {
      res.json({
        departments,
        currentPage: page,
        totalPages: Math.ceil((await specialityModel.countDocuments()) / limit),
      });
    } else {
      let messages = "users not exist";
    }
    // console.log(departments);
  } catch (error) {
    res.json({ error });
  }
};

const editDept = async (req, res) => {
  try {
    console.log(req.body);
    const dept = req.body.data;
    await specialityModel
      .findByIdAndUpdate(req.body.id, {
        name: dept.name,
        description: dept.description,
        deptImg: dept.deptImg,
        status: dept.status,
      })
      .then((data) => {
        console.log(data);
        res.json({ message: "successfully updated " });
      });
  } catch (error) {
    res.json({ error });
  }
};

const viewSpeciality = async (req, res) => {
  try {
    const department = await specialityModel.findById(req.body.id);
    if (department) {
      res.json({ department, message: "succuss" });
    } else {
      res.json({ message: "departmet failed" });
    }
  } catch (error) {
    res.json({ error });
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
    res.json({ error });
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
    res.json({ error });
  }
};

const getDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const query = {
      status: true,
    };
    console.log(page, "paagggeeeee  ");
    const doctor = await DoctorModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(doctor);
    if (doctor.length) {
      res.json({
        doctor,
        currentPage: page,
        totalPages: Math.ceil(
          (await DoctorModel.countDocuments(query)) / limit
        ),
      });
    } else {
      let messages = "doctors not exist";
    }
  } catch (error) {
    res.json({ error });
  }
};

const Appoinments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    console.log(page, "paagggeeeee  ");
    const appoinments = await userAppoinmentModel
      .find().populate('user')
      .skip((page - 1) * limit)
      .limit(limit)
    console.log(appoinments);
    if (appoinments.length) {
      res.json({
        appoinments,
        currentPage: page,
        totalPages: Math.ceil(
          (await userAppoinmentModel.countDocuments()) / limit
        ),
      });
    } else {
      let messages = "appoinments not exist";
    }
  } catch (error) {
    res.json({ error });
  }
};

const blockDoctor = async (req, res) => {
  try {
    console.log("okkkkkkkkkkkkkkkk");
    console.log("hii" + req.body);
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
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
    res.json({ error });
  }
};

const unblockDoctor = async (req, res) => {
  try {
    console.log(req.body, "boodyyy");
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
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
    res.json({ error });
  }
};

const DoctorPending = async (req, res) => {
  try {
    const doctor = await DoctorModel.find({ status: false });
    if (doctor) {
      res.json({ doctor });
    } else {
      let messages = "doctors not exist";
    }
    console.log(doctor);
  } catch (error) {
    res.json({ error });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      status: true,
      doctorStatus: "active",
    });

    if (doctor) {
      res.status(201).send({ success: true });
    } else {
      return res.status(200).send({ success: false });
    }
  } catch (error) {
    res.json({ error });
  }
};

const rejectDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      status: true,
      doctorStatus: "reject",
      rejectReason: req.body.data,
    });

    if (doctor) {
      res.status(201).send({ success: true });
    } else {
      return res.status(200).send({ success: false });
    }
  } catch (error) {
    res.json({ error });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await specialityModel.findByIdAndRemove(req.query.id).then((department) => {
      if (department) {
        res.status(201).send({
          message: `${department.department} Department deleted`,
          success: true,
        });
      } else {
        return res.status(200).send({
          message: `${department.department} Department does not Exist`,
          success: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `deleteDepartments controller ${error.message}`,
    });
  }
};

export default {
  AdminLogin,

  getusers,
  speciality,
  getSpeciality,
  blockUser,
  unblockUser,
  getDoctors,
  editDept,
  blockDoctor,
  unblockDoctor,
  DoctorPending,
  approveDoctor,
  viewSpeciality,
  deleteDepartment,
  rejectDoctor,
  Appoinments,
};
