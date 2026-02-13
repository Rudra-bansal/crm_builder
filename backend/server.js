const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Booking = require("./models/Booking");
const Payment = require("./models/Payment");
const Expense = require("./models/Expense");
const Project = require("./models/Project");
const Lead = require("./models/Lead");
const Unit = require("./models/Unit");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/project");
app.use("/api/projects", projectRoutes);

const leadRoutes = require("./routes/lead");
app.use("/api/leads", leadRoutes);

const unitRoutes = require("./routes/unit");
app.use("/api/units", unitRoutes);

const bookingRoutes = require("./routes/booking");
app.use("/api/bookings", bookingRoutes);

const paymentRoutes = require("./routes/payment");
app.use("/api/payments", paymentRoutes);

const expenseRoutes = require("./routes/expense");
app.use("/api/expenses", expenseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

app.get("/", (req, res) => {
  res.send("Builder CRM Backend Running 🚀");
});

/* ================================
   DASHBOARD ROUTES (Protected)
================================ */

// PROFIT SUMMARY (Company Wise)
app.get("/api/dashboard/profit-summary", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    });

    const result = [];

    for (let p of projects) {
      const bookings = await Booking.find({
        companyId: req.user.companyId,
      }).populate("unitId");

      // Filter bookings by projectId through unitId
      const projectBookings = bookings.filter(
        (b) => b.unitId && b.unitId.projectId.toString() === p._id.toString()
      );

      const totalSales = projectBookings.reduce(
        (sum, b) => sum + b.sellingPrice,
        0
      );

      // Total received
      let totalReceived = 0;
      for (let b of projectBookings) {
        const payments = await Payment.find({
          bookingId: b._id,
          companyId: req.user.companyId,
        });

        totalReceived += payments.reduce((sum, pay) => sum + pay.amount, 0);
      }

      const expenses = await Expense.find({
        projectId: p._id,
        companyId: req.user.companyId,
      });

      const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

      const profit = totalSales - totalExpense;
      const due = totalSales - totalReceived;

      result.push({
        projectId: p._id,
        projectName: p.name,
        location: p.location,
        totalSales,
        totalReceived,
        totalExpense,
        due,
        profit,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profit summary", error });
  }
});

// OVERVIEW (Company Wise)
app.get("/api/dashboard/overview", authMiddleware, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({
      companyId: req.user.companyId,
    });

    const totalLeads = await Lead.countDocuments({
      companyId: req.user.companyId,
    });

    const totalUnits = await Unit.countDocuments({
      companyId: req.user.companyId,
    });

    const soldUnits = await Unit.countDocuments({
      companyId: req.user.companyId,
      status: "Sold",
    });

    const bookings = await Booking.find({
      companyId: req.user.companyId,
    })
      .populate("leadId")
      .populate("unitId");

    const totalSales = bookings.reduce((sum, b) => sum + b.sellingPrice, 0);

    const payments = await Payment.find({
      companyId: req.user.companyId,
    });

    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);

    const expenses = await Expense.find({
      companyId: req.user.companyId,
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const due = totalSales - totalReceived;
    const profit = totalSales - totalExpense;

    const recentLeads = await Lead.find({
      companyId: req.user.companyId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find({
      companyId: req.user.companyId,
    })
      .populate("leadId")
      .populate("unitId")
      .sort({ createdAt: -1 })
      .limit(5);

    const statusSummary = {
      new: await Lead.countDocuments({
        companyId: req.user.companyId,
        status: "New",
      }),
      followup: await Lead.countDocuments({
        companyId: req.user.companyId,
        status: "Follow-up",
      }),
      siteVisit: await Lead.countDocuments({
        companyId: req.user.companyId,
        status: "Site Visit",
      }),
      booked: await Lead.countDocuments({
        companyId: req.user.companyId,
        status: "Booked",
      }),
      lost: await Lead.countDocuments({
        companyId: req.user.companyId,
        status: "Lost",
      }),
    };

    res.json({
      totalProjects,
      totalLeads,
      totalUnits,
      soldUnits,
      totalSales,
      totalReceived,
      totalExpense,
      due,
      profit,
      recentLeads,
      recentBookings,
      statusSummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard overview failed", error });
  }
});

// FOLLOWUP ALERTS (Company Wise)
app.get("/api/dashboard/followup-alerts", authMiddleware, async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayFollowups = await Lead.find({
      companyId: req.user.companyId,
      followUpDate: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: "Lost" },
    }).sort({ followUpDate: 1 });

    const overdueFollowups = await Lead.find({
      companyId: req.user.companyId,
      followUpDate: { $lt: todayStart },
      status: { $ne: "Lost" },
    }).sort({ followUpDate: 1 });

    res.json({
      todayCount: todayFollowups.length,
      overdueCount: overdueFollowups.length,
      todayFollowups,
      overdueFollowups,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch follow-up alerts", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
