const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (Creates Company + Admin User)
exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName, companyLocation } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create Company
    const company = await Company.create({
      name: companyName,
      location: companyLocation,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User as Admin
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      companyId: company._id,
    });

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      company: {
        id: company._id,
        name: company.name,
        location: company.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("companyId");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId._id,
        companyName: user.companyId.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
