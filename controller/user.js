const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, password, email, mobile } = req.body;

    if (!name || !password || !email || !mobile) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    await userData.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: userDetails._id, name: userDetails.name },
      process.env.SECRET_CODE,
      { expiresIn: "60s" }
    );

    console.log(token);

    res.json({
      message: "User logged in",
      token: token,
      name: userDetails.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { registerUser, loginUser };
