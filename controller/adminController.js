import AdminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import  jwt  from "../utils/jwt.js";

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
          console.log(token);
          console.log('haiaiiii');
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

export default { AdminLogin, isAdmin };
