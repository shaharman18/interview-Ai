const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to prioritize IPv4 over IPv6. 
// This fixes the 'ENETUNREACH' error on platforms like Render.
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: (process.env.GMAIL_USER || '').trim(),
        pass: (process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s/g, '') // remove any spaces
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("Mail Transporter Error:", error.message);
    } else {
        console.log("Mail Server is ready to take our messages");
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"Interview AI" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verification Code for Interview AI',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4A90E2; text-align: center;">Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for joining Interview AI. Please use the following OTP code to verify your account. This code is valid for 10 minutes.</p>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Interview AI. All rights reserved.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendPasswordReset = async (email, otp) => {
    const mailOptions = {
        from: `"Interview AI" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Code - Interview AI',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #E24A4A; text-align: center;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the following code to proceed:</p>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Interview AI. All rights reserved.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendPasswordReset };
