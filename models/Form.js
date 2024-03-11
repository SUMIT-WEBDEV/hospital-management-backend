const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  form_title: {
    type: String,
    required: true,
    unique: true,
  },
  answered: {
    type: Boolean,
    default: false,
  },
  actions: [
    {
      form_type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "biweekly", "onetime"],
      },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient",
      },
      view_date: Date,
    },
  ],
  questions: [
    {
      type: {
        type: String,
      },
      question_title: {
        type: String,
      },
      choice1: {
        type: String,
      },
      choice2: {
        type: String,
      },
      choice3: {
        type: String,
      },
      choice4: {
        type: String,
      },
      answers: [
        {
          patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient",
          },
          data: {
            type: mongoose.Schema.Types.Mixed,
          },
          fillingDate: Date,
        },
      ],
    },
  ],
  createdOn: Date,
  status: {
    type: String,
    default: "Active", //De-Active
  },
});

module.exports = mongoose.model("form", FormSchema);
