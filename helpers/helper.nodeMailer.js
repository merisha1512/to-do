const nodeMailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendMail = async(email,name ,Token)=>{
const transport = nodeMailer.createTransport({
    service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    })
// html template source
const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "../authentication/resetPassword.template.hbs"),"utf8");

//HBS
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ name: name, token: Token });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: htmlToSend,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info.envelope);
  });
}
module.exports ={sendMail}

