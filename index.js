const express = require("express");
const app = express();

// Database
require("./src/database/config");

const auth = require("./src/routes/auth");
const user = require("./src/routes/uers");

// Middleware
app.use(express.json());

// Routes
app.use("/api", auth);
app.use("/api", user);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
