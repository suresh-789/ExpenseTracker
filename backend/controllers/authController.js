const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create email sender using SendGrid
const sendEmail = async (to, subject, html) => {
  try {
    const result = await sgMail.send({
      to: to,
      from: "expensetracker390@gmail.com",
      subject: subject,
      html: html,
    });
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("SendGrid error:", error);
    throw error;
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation: Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Register User
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, profileImageUrl } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log("Forgot password request received for:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    
    console.log("User found:", user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to user (valid for 10 minutes)
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP via email
    const emailHtml = `
      <h1>Password Reset OTP</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(email, "Password Reset OTP", emailHtml);

    res.status(200).json({ message: "OTP sent to your email", email: email });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    // Return success for security - don't reveal if email was sent or not
    res.status(200).json({ message: "If an account exists with this email, an OTP will be sent" });
  }
};

// Reset Password with OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP and new password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.resetPasswordToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Error resetting password" });
  }
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if token is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
