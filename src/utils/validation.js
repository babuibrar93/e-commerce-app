const validator = require("validator");
exports.validation = (username, email) => {
  let usernameRegex = /^[0-9]+$/;
  let validity = usernameRegex.test(username) ? false : true;

  if (!validity && !validator.isEmail(email)) {
    return "Please enter a valid username and email";
  } else if (!validity) {
    return "Please enter a valid username";
  } else if (!validator.isEmail(email)) {
    return "Please enter a valid email";
  }

  return null;
};
