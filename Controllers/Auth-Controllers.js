const User = require("../Models/user-model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const EmailVerification = require("../Models/EmailVerification-model");

// Home
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to home page by controller");
  } catch (error) {
    console.log(error);
  }
};

// Register User (already implemented with OTP send)
const reg = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "user exists" });
    }

    const saltround = 5;
    const hash_password = await bcrypt.hash(password, saltround);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hash_password,
    });

    // Generate OTP and store in EmailVerification collection
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailVerification.findOneAndUpdate(
      { email: userCreated.email },
      { email: userCreated.email, otp, expiresAt, isVerified: false },
      { upsert: true, new: true }
    );

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userCreated.email,
      subject: "Verify your email - OTP",
      text: `Hello ${userCreated.username},\n\nYour OTP is: ${otp}\nIt expires in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      //console.log(`OTP sent to ${userCreated.email}`);
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
    }

    res.status(201).json({
      msg: "user successfully registered",
      user: userCreated,
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
      otpsent: true,
    });
  } catch (error) {
    console.log("Registration error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Send OTP (if user requests OTP again)
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await EmailVerification.findOneAndUpdate(
    { email },
    { email, otp, expiresAt, isVerified: false },
    { upsert: true, new: true }
  );

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  res.json({ msg: "OTP sent successfully" });
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await EmailVerification.findOne({ email });

    if (!record) return res.status(400).json({ msg: "No OTP sent for this email" });
    if (record.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

    // Mark as verified
    record.isVerified = true;
    await record.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) return res.status(400).json({ msg: "Invalid credentials" });

    // Check password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) return res.status(401).json({ msg: "Invalid credentials" });

    // Check email verification
    const emailVerification = await EmailVerification.findOne({ email });
    if (!emailVerification?.isVerified) {
      return res.status(403).json({ msg: "Email not verified. Please verify OTP first." });
    }

    // Everything okay → send JWT
    return res.status(200).json({
      msg: "User successfully logged in",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
      isAdmin: userExist.isAdmin,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const user = async (req, res) => {
    try {
        const userdata = req.user; // req.user is populated by authMiddleware
        res.status(200).json(userdata);
    } catch (error) {
        console.log("user error", error);
        res.status(500).json({ msg: "Server error" });
    }
};


module.exports = { home, reg, user, login, sendOtp, verifyOtp };
