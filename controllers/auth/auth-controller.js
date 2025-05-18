const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists with this email! Please Try again .",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res
      .status(200)
      .json({ success: true, message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Some Error Occured" });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({ success: false, message: "User doesn't exist " });
    }
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({ success: false, message: "Password is Incorrect" });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "User Logged in Successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Some Error Occured" });
  }
};
// logout
const logoutUser = async (req, res) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "User Logged out Successfully" });
};
// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthenticated" });
  }
  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthenticated" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
