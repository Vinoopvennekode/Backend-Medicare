import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import bodyParser from "body-parser";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";

// import bcrypt from "bcrypt";
// import adminDB from './models/adminModel.js'

//*  CONFIGURATION *//
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//* Database *//
connectDB();


// const addadmin =  async() => {
// let password = "123456"

// let salt = await bcrypt.genSalt(10)
// let pass = await bcrypt.hash(password, salt)
// let email = "admin@gmail.com"
//  await adminDB.insertMany({
//     email:email,
//     password:pass,
    
//   })
// }
//  addadmin()



//*  ROUTES   *//
app.use("/", userRouter);
app.use("/admin", adminRouter);

//*Port Connect *//
app.listen(
  process.env.PORT,
  console.log(`server connected in ${process.env.PORT}`)
);
