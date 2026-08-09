import nodemailer from "nodemailer";
import 'dotenv/config'

export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const baseUrl = process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.replace(/\/+$/, '')
        : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email:
           ${baseUrl}/verify/${token} 
           Thanks`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.error('Failed to send verification email:', error);
            return;
        }
        console.log('Email Sent Successfully:', info.response);
    });
}



