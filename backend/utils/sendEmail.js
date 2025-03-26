import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  name,
  link
) => {
  //Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  //Options for sending email
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject,
    template,
    context: {
      name,
      link,
    },
  };

  //Send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;

//!Activar correo de aplicación en Gmail
//*Paso 1
//?https://github.com/frank-gp/doc/blob/main/backend/nodejs/nodemailer/nodemailer.md
//*Paso 2
//?https://accounts.google.com/v3/signin/challenge/pk/presend?TL=ADgdZ7R5-EADa5C6wYVqUQBWcX4dk__KjR7NmqokHbb9nUBQF0JXJFES2kAnUxy-&cid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fapppasswords&flowName=GlifWebSignIn&followup=https%3A%2F%2Fmyaccount.google.com%2Fapppasswords&ifkv=ASSHykrJ06lRsF4NJrBAG-0nQnERWa6SigrbQ5UfNq_K3y7_KypXOCsbP1rxbYTOMSRY-j8497nu9g&osid=1&rart=ANgoxcd2pR8hN5LRfOnILyL4SN_1lcei4V0eiKMETGH7R5UdpDfHZ0UUcONyd-ofSuQj4j482IRfAiPalnFfJAWUmOhiM-vP-bDbmlj_ME7ri6219OAHmU8&rpbg=1&service=accountsettings
