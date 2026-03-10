import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../Models/User.js";

const createuser = async (req, res) => {
  try {
    const { Firstname, Lastname, Email, Phonenumber, Password } = req.body;

    if (!Firstname || !Lastname || !Email || !Phonenumber || !Password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ Phonenumber });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newuser = await User.create({
      Firstname,
      Lastname,
      Email,
      Phonenumber,
      Password: hashedPassword,
    });

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject: 'Welcome to Loan App',
        html: `<h2>Welcome ${Firstname}!</h2><p>Your account has been successfully created.</p>`
      });

      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.Email,
          subject: 'New User Registration',
          html: `<h3>New User Registered</h3><p><strong>Name:</strong> ${Firstname} ${Lastname}</p><p><strong>Email:</strong> ${Email}</p><p><strong>Phone:</strong> ${Phonenumber}</p>`
        });
      }
    } catch (emailError) {
      console.log('Email notification failed:', emailError.message);
    }

    res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const checkEmail = await User.findOne({ Email });
    if (!checkEmail) {
      return res.status(400).json({ success: false, message: "Account does not exist. Please sign up." });
    }

    const checkPassword = await bcrypt.compare(Password, checkEmail.Password);
    if (!checkPassword) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: checkEmail._id, role: checkEmail.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 3600000),
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-Password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User updated successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-Password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Email,
      subject: 'Password Reset OTP',
      html: `<h2>Password Reset</h2><p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { Email, otp, newPassword } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createuser, getAllUsers, deleteUser, updateUser, login, logout, getProfile, forgotPassword, resetPassword };