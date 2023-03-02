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
});

const AppoinmentModel = mongoose.model("Appoinment", appoinmetSchema);

export default AppoinmentModel;
