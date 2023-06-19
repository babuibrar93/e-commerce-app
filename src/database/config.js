const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connection
const URL = process.env.MONGODB_URL|| process.env.LOCAL_URL;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(({message}) => {
    console.log(message);
  });
