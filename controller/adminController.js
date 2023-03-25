/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable radix */
import bcrypt from "bcrypt";
import AdminModel from "../models/adminModel.js";
import UserModel from "../models/user.js";
import SpecialityModel from "../models/specialityModel.js";
import DoctorModel from "../models/DoctorModel.js";
import jwt from "../utils/jwt.js";
import {
  userAppoinmentModel,
  AppoinmentModel,
} from "../models/AppoinmentModel.js";

const AdminLogin = async (req, res) => {
  try {
    const adminResult = {
      Status: false,
      message: null,
      token: null,
    };

    const adminDetails = req.body;
    if (adminDetails.email && adminDetails.password) {
      const admin = await AdminModel.findOne({ email: adminDetails.email });

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
      const messages = "users not exist";
      res.json({ messages });
    }
  } catch (error) {
    res.json({ error });
  }
};

const speciality = async (req, res) => {
  try {
    const { name, description, deptImg } = req.body;

    if (name && description && deptImg) {
      const regex = new RegExp(name, "i");
      const isSpeciality = await SpecialityModel.find({
        name: { $regex: regex },
      });

      if (isSpeciality.length === 0) {
        const newSpeciality = new SpecialityModel({
          name,
          description,
          deptImg,
        });
        await newSpeciality.save();
        const message = "succuss";
        res.json({ message, status: true });
      } else {
        const message = "speciality already exist";
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

    const departments = await SpecialityModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (departments) {
      res.json({
        departments,
        currentPage: page,
        totalPages: Math.ceil((await SpecialityModel.countDocuments()) / limit),
      });
    } else {
      const messages = "users not exist";
      res.json({ messages });
    }
  } catch (error) {
    res.json({ error });
  }
};

const editDept = async (req, res) => {
  try {
    const dept = req.body.data;
    SpecialityModel.findByIdAndUpdate(req.body.id, {
      name: dept.name,
      description: dept.description,
      deptImg: dept.deptImg,
      status: dept.status,
    }).then(() => {
      res.json({ message: "successfully updated " });
    });
  } catch (error) {
    res.json({ error });
  }
};

const viewSpeciality = async (req, res) => {
  try {
    const department = await SpecialityModel.findById(req.body.id);
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
    const client = await UserModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });

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
    const client = await UserModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });

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

    const doctor = await DoctorModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    if (doctor.length) {
      res.json({
        doctor,
        currentPage: page,
        totalPages: Math.ceil(
          (await DoctorModel.countDocuments(query)) / limit
        ),
      });
    } else {
      const messages = "doctors not exist";
      res.json({ messages });
    }
  } catch (error) {
    res.json({ error });
  }
};

const Appoinments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const appoinments = await userAppoinmentModel
      .find()
      .populate("user")
      .skip((page - 1) * limit)
      .limit(limit);

    if (appoinments.length) {
      res.json({
        appoinments,
        currentPage: page,
        totalPages: Math.ceil(
          (await userAppoinmentModel.countDocuments()) / limit
        ),
      });
    } else {
      const messages = "appoinments not exist";
      res.json({ messages });
    }
  } catch (error) {
    res.json({ error });
  }
};

const blockDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });

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
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });

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
      const messages = "doctors not exist";
      res.json({ messages });
    }
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
    await SpecialityModel.findByIdAndRemove(req.query.id).then((department) => {
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
    res.status(500).send({
      success: false,
      message: `deleteDepartments controller ${error.message}`,
    });
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
    const doctors = await DoctorModel.find({ status: true }).count();

    const users = await UserModel.find().count();

    const doctorPending = await DoctorModel.find({ status: false }).count();

    const departments = await SpecialityModel.find().count();

    const salesReport = await userAppoinmentModel.aggregate([
      {
        $match: {
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
    console.log(newSalesReport, "sales");
    res.json({
      doctors,
      users,
      doctorPending,
      departments,
      salesReport: newSalesReport,
    });
  } catch (error) {
    res.json({ error });
  }
};

export default {
  AdminLogin,
  dashboard,
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
