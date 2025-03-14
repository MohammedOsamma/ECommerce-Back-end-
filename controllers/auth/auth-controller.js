const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

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

// logout

// Auth middleware

module.exports = { registerUser };
