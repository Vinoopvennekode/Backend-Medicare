import mongoose from "mongoose";

const appoinmetSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Docter",
  },
  appoinments: [
    {
      day: {
        type: String,
      },
      time: [
        {
          start: {
            type: String,
          },
          end: {
            type: String,
          },
        },
      ],
    },
  ],
}, {
  timestamps: true,
});

const userAppoinment = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Docter",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    age: {
      type: String,
    },
    symptoms: {
      type: String,
    },
    date: {
      type: String,
    },
    timeStart: {
      type: String,
    },
    timeEnd: {
      type: String,
    },
    allotedTime: {
      type: String,
    },
    fee: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "not done",
    },
  },
  {
    timestamps: true,
  }
);

export const AppoinmentModel = mongoose.model("Appoinment", appoinmetSchema);
export const userAppoinmentModel = mongoose.model(
  "userAppoinment",
  userAppoinment
);
