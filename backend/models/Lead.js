const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    budget: { type: String },

    status: {
      type: String,
      enum: ["New", "Follow-up", "Site Visit", "Booked", "Lost"],
      default: "New",
    },

    source: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    followUpDate: { type: Date },

    notes: [
      {
        note: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
