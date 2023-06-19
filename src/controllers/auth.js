const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { sendVerificationCode } = require("../utils/sendVerificationCode");
const { validation } = require("../utils/validation");
const {
  generateVerificationCode,
} = require("../utils/generateVerificationCode");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const message = validation(username, email);
    if (message) {
      return res.status(400).send({
        message,
      });
    }
    const verificationCode = generateVerificationCode();
    const user = new User({ username, email, password, verificationCode });

    // Check if any of the required fields is missing
    if (!username || !email || !password) {
      return res.status(400).send({
        message: "Username, email, or password is missing",
      });
    }

    // Check if user already exists
    const alreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (alreadyExists) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    // await sendVerificationCode(email, verificationCode);

    // Save user
    await user.save();
    return res.status(201).send({
      message:
        "Registration successful. Please check your email for the verification code.",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).send({
        message: "Username or password is required",
      });
    }

    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).send({
        message: "User not found",
      });
    }
    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }

    // Generate auth token
    const token = user.generateAuthToken();
    user.token = token;
    await user.save();
    return res.status(200).send({
      message: "User logged in successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.verification = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }
    if (!user && !user.verificationCode) {
      return res.status(400).send({
        message: "Invalid verification code",
      });
    }

    if (user && user.updatedAt) {
      const createdAtDate = new Date(user.updatedAt);
      const currentTimestamp = Date.now();
      const createdAtTimestamp = createdAtDate.getTime();
      const difference = currentTimestamp - createdAtTimestamp;

      if (difference > 1000 * 20) {
        return res.status(400).send({
          message: "Verification code has been expired",
        });
      }
    }

    user.isVerified = true;
    user.verificationCode = null;

    await user.save();
    return res.status(201).send({
      message: "User verified successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  const { identifier } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;

    await user.save();
    return res.status(200).send({
      message: `Verification code has been set to ${user.email}`,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { identifier, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).send({
        message: "Password or confirm password is missing",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        message: "Password and confirm password do not match",
      });
    }

    user.password = password;
    await user.save();
    return res.status(200).send({
      message: "Password reset successful",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        message: "Old password or new password is missing",
      });
    }

    const user = await User.findByIdAndUpdate({ _id: userId });
    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }
    const authenticatedUser = await bcrypt.compare(oldPassword, user.password);
    if (!authenticatedUser) {
      return res.status(400).send({
        message: "Invalid old password",
      });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).send({
      message: "Password changed successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.changeIdentifier = async (req, res) => {
  const { userId } = req.user;
  const { identifier } = req.body;

  try {
    if (!identifier) {
      return res.status(400).send({
        message: "Identifier is missing",
      });
    }

    const user = await User.findById({
      _id: userId,
    });

    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }

    validator.isEmail(identifier)
      ? (user.email = identifier)
      : (user.username = identifier);

    await user.save();
    return res.status(200).send({
      message: "Identifier changed successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).send({
        message: "No user found",
      });
    }
    user.token = null;
    await user.save();
    return res.status(200).send({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
