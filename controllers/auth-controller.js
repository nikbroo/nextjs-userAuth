const userModal = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const checkExistingUser = await userModal.findOne({
      $or: [{ userName }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "user exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new userModal({
      userName,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await createdUser.save();

    if (createdUser) {
      res.status(200).json({
        success: true,
        message: "user created",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "unable to create user",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await userModal.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid user",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "wrong password",
      });
    }

    const accessToken = await jwt.sign(
      {
        userId: user?.id,
        email: user?.email,
        role: user?.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "login successfully",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await userModal.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User Not Found.",
      });
    }

    const isPasswordMatch = await jwt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "Wrong Password.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Update.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
