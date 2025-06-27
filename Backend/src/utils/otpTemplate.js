// src/utils/otpTemplate.js
exports.otpTemplate = (name, code) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering.</p>
        <p>Your OTP Code is:</p>
        <h1 style="color: #4CAF50;">${code}</h1>
        <p>This OTP is valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
        <br>
        <p>Regards,<br><b>Your App Team</b></p>
    </div>
`;