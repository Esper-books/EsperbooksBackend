const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'pmms.mgt@gmail.com', 
        pass: 'zuoqhyisecgytixq' 
    }
});


// send mail with defined transport object

function sendCreateMailNotification(pres){
    console.log(pres.emailAddress);
    let mailOptions = {
        from: '"Esper Book" pmms.mgt@gmail.com', 
        to: pres.emailAddress, 
        subject: 'Company Creation Sign up', 
        text: process.env.BASE_URI+'esperbook/signUp?token='+pres.companyToken
        // html: '<b>baseUrl+token</b>'
    };
transporter.sendMail(mailOptions, (error, info) => {
    
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
}
 
module.exports = {
    sendCreateMailNotification : sendCreateMailNotification
   }
