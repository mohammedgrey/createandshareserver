const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    service: 'SendGrid',
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: `createANDshare <${process.env.EMAIL_SENDER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<strong>${options.message}</strong>`
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
