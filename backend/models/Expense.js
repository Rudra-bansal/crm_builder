const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    title: { type: String, required: true },
    category: { type: String }, // Material / Labour / Legal / Marketing etc.
    amount: { type: Number, required: true },

    expenseDate: { type: Date, default: Date.now },
    remarks: { type: String },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
