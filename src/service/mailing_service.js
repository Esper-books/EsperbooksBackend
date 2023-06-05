const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_TRANSPORT_USER,
    pass: process.env.EMAIL_TRANSPORT_PASS,
  },
});

// send mail with defined transport object

function sendCreateMailNotification(pres) {
  let mailOptions = {
    from: process.env.EMAIL_TRANSPORT_FROM,
    to: pres.emailAddress,
    subject: process.env.EMAIL_COMPANY_CREATE_SUBJECT,
    text:
      process.env.BASE_URI +
      process.env.EMAIL_COMPANY_SIGNUP_USER_URL +
      pres.companyToken,
    // html: '<b>baseUrl+token</b>'
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}


function sendResetPasswordNotification(pres) {
    let mailOptions = {
      from: process.env.EMAIL_TRANSPORT_FROM,
      to: pres.email,
      subject: "RESET PASSWORD NOTIFICATION",
      text:
        process.env.BASE_URI +
        "/user/resetpassword?token=" +
        pres.token,
      // html: '<b>baseUrl+token</b>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
  }

module.exports = {
  sendCreateMailNotification,sendResetPasswordNotification
};
