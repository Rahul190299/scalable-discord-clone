import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

export class Nodemailer {

      // async..await is not allowed in global scope, must use a wrapper
      public static async SendMail(from : string ,to:string,otp:string) {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: from, // sender address
          to: to, // list of receivers
          subject: "Verify yout email", // Subject line
          text: `Your OTP code is ${otp}. It will expire in 10 minutes.`, // plain text body
          html: "<b>Hello world?</b>", // html body
        });
      
        //console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      
}


