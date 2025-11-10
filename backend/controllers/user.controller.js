import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Your Name.",
      });
    }

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Your Valid Email and Password!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered With thi Email.",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Successfull to Register.",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Register!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(404).json({
        success: false,
        message: "Please Enter Valid Email & Password!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found With This Email!",
      });
    }

    const token = await User.generateToken(user._id, res);

    const verifyPassword = await user.comparePassword(password);
    if (!verifyPassword) {
      return res.status(404).json({
        success: false,
        message: "Please Enter Valid Email & Password!",
      });
    }
    res.status(201).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        token,
        role: user.role,
        username: user.username,
      },
      message: "Successfull to Login",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Login!",
    });
  }
};
