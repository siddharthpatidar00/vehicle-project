const cron = require('node-cron');
const User = require('../models/User');

const otpCleanupJob = () => {
    cron.schedule('*/10 * * * *', async () => {
        const now = new Date();
        const result = await User.updateMany(
            { 'otp.expires': { $lt: now } },
            { $unset: { otp: "" } }
        );
        console.log(`${result.modifiedCount} expired OTPs cleared`);
    });
};

module.exports = otpCleanupJob;
