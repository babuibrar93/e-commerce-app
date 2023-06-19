const { singleUser } = require("../controllers/user");
const { auth } = require("../middleware/auth/auth");

const router = require("express").Router();

router.get('/user/single-user', auth, singleUser)
module.exports = router;
