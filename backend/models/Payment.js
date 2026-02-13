const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },

    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque"],
      default: "Cash",
    },

    paymentDate: { type: Date, default: Date.now },
    remarks: { type: String },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
