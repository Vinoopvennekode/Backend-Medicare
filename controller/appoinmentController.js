import AppoinmentModel from "../models/AppoinmentModel.js";
import DocterModel from "../models/DocterModel.js";
import mongoose from "mongoose";
const DRappoinment = async (req, res) => {
  try {
    const { day, start, end } = req.body.data;
    console.log(req.body);
    const id = req.body.id;
    if (day && start && end) {
      const doc = await AppoinmentModel.findOne({ doctor: id });
      if (!doc) {
        const appoinment = new AppoinmentModel({
          doctor: id,
          appoinments: [{ day: day, time: [{ start: start, end: end }] }],
        });
        appoinment.save();
      } else {
        const doctor = await AppoinmentModel.findOne({ doctor: id });
        const app = doctor.appoinments.find((ele) => ele.day === day);

        if (app) {
          const doc = await AppoinmentModel.findOneAndUpdate(
            { doctor: id, "appoinments._id": app._id },
            {
              $push: { "appoinments.$.time": { start: start, end: end } },
            }
          );
        } else {
          const doc = await AppoinmentModel.findOneAndUpdate(
            { doctor: id },
            {
              $push: {
                appoinments: [{ day: day, time: [{ start: start, end: end }] }],
              },
            }
          );
        }
      }

      res.json({ status: "done" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

const viewAppoinment = async (req, res) => {
  try {
    console.log(req.body);
    const doctorId = req.body.data;
    const appoinment = await AppoinmentModel.findOne({ doctor: doctorId });
    const app = appoinment.appoinments;

    res.json({ app });
  } catch (error) {
    res.json({ error });
  }
};
const deleteAppoinment = async (req, res) => {
  try {
    const { id, doctor } = req.query;
    console.log(id, doctor);
    const data = await AppoinmentModel.findOne({ doctor: doctor });
    console.log(data);
    if (!data) {
    } else {
      data.appoinments.forEach((day) => {
        day.time.pull({ _id: id });
      });
      data.save().then((result) => {
        res.json(result.appoinments);
      });
    }
  } catch (error) {
    res.json(error);
  }
};
export default { DRappoinment, viewAppoinment, deleteAppoinment };
