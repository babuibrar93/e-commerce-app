const nodemailer = require("nodemailer");

// Function to send the verification code via email
exports.sendVerificationCode = async (email, verificationCode) => {
    try {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Configure your email service provider details
        service: "Gmail",
        auth: {
          user: "saabm6546@gmail.com",
          pass: "babuibrar0344",
        },
      });
  
      // Configure the email message
      const mailOptions = {
        from: "saabm6546@gmail.com",
        to: email,
        subject: "Verification Code",
        text: `Your verification code is: ${verificationCode}`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };
  