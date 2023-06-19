const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has been expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    // Attach the decoded payload to the request object
    req.user = decoded;

    next();
  });
};
