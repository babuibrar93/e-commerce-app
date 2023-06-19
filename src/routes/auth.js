const router = require("express").Router();
const {
  register,
  login,
  verification,
  forgetPassword,
  resetPassword,
  changePassword,
  changeIdentifier,
  logout,
} = require("../controllers/auth");
const { auth } = require("../middleware/auth/auth");
const { checkUserVerification } = require("../middleware/auth/verification");

router.post("/auth/register", register);
router.post("/auth/login", checkUserVerification, login);
router.post("/auth/verification", verification);
router.post("/auth/forget-password", forgetPassword);
router.post("/auth/reset-password", verification, resetPassword);
router.post("/auth/change-password", auth, changePassword);
router.post("/auth/change-indentifier", auth, changeIdentifier);
router.post("/auth/logout", auth, logout);

module.exports = router;
