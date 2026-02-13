const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    tower: { type: String },
    floor: { type: Number },
    unitNumber: { type: String, required: true },

    type: { type: String }, // 2BHK / 3BHK
    area: { type: Number }, // sqft

    basePrice: { type: Number },

    status: {
      type: String,
      enum: ["Available", "Hold", "Sold"],
      default: "Available",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Unit", unitSchema);
