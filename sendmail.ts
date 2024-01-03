import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();



const sendMail=async (sendTo:string[],mesaage:string)=>{


    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:process.env.EMAIL_FROM,
            pass:process.env.APP_PASSWORD
        }

    });
    const mailOptions ={
        from:process.env.EMAIL_FROM,
        to:sendTo,
        subject:"New Message",
        text:`
        Message:${mesaage}
        `
    }
    const info = await transporter.sendMail(mailOptions)

}

export default sendMail;