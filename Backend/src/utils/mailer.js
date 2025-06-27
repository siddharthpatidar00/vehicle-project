const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS } = require('../config/adminConfig');

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });
};

const sendMail = async (to, subject, html, attempt = 1) => {
    const transporter = getTransporter();
    const mailOptions = {
        from: `"Your App" <${GMAIL_USER}>`,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Attempt ${attempt}: Failed to send email`, error);
        if (attempt < 3) {
            setTimeout(() => sendMail(to, subject, html, attempt + 1), 2000);
        } else {
            throw error;
        }
    }
};

module.exports = { sendMail };
