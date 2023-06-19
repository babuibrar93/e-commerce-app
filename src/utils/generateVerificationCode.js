exports.generateVerificationCode = () => {
    const length = 6; // Length of the verification code
    const min = Math.pow(10, length - 1); // Minimum value of the verification code
    const max = Math.pow(10, length) - 1; // Maximum value of the verification code
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };