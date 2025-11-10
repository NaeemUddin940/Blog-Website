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

    res
      .status(201)
      .json({
        success: true,
        user: newUser,
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
