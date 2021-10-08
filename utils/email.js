const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  // 1. Create a transporter
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Active in gmail "less secure app" option
  });
  // 2. Define the email option
  const mailOptions = {
    from: 'Trung Vinh <admin@zunggzing.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
