const { default: mongoose } = require("mongoose");
const User = require("../models/user");

exports.singleUser = async (req, res) => {
  const { identifier } = req.body;
  let query;
  try {
    if (mongoose.isValidObjectId(identifier)) {
      query = { _id: identifier };
    } else {
      query = { $or: [{ username: identifier }, { email: identifier }] };
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    res.status(200).send({
      message: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
