const User = require("../../models/user");

exports.checkUserVerification = async (req, res, next) => {
  const { identifier } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { email: identifier }],
    });

    if (user && !user.isVerified) {
      return res.status(401).send({
        message: "User is not verified. Kindly verify your account first.",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
