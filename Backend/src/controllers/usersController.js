const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/UsersModel');
const { otpTemplate } = require('../utils/otpTemplate');
const { sendMail } = require('../utils/mailer');

// ✅ Updated generateToken to include email
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

exports.createUser = async (req, res) => {
    try {
        const {
            first_name, last_name, gender, email, password,
            mobile, company, gst, pan, dob,
            aadhar, city, address, status
        } = req.body;

        if (!first_name || !last_name || !gender || !email || !password) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const existing = await Users.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new Users({
            first_name,
            last_name,
            gender,
            email,
            password,
            mobile,
            company,
            gst,
            pan,
            dob,
            aadhar,
            city,
            address,
            status
        });

        const otpCode = crypto.randomInt(100000, 999999).toString();
        user.otp = otpCode;
        user.otpExpire = Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10) * 60 * 1000;

        await user.save();
        await sendMail(
            user.email,
            'Your Verification Code',
            otpTemplate(user.first_name, otpCode)
        );

        const token = generateToken(user); // ✅ use full user object here
        res.status(201).json({
            message: 'User registered. OTP sent to email.',
            token,
            user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    try {
        const user = await Users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = Date.now();
        if (user.otp !== otp || now > user.otpExpire) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpire = undefined;
        user.verified = true;
        await user.save();

        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otpCode = crypto.randomInt(100000, 999999).toString();
        user.otp = otpCode;
        user.otpExpire = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || '10') * 60 * 1000);
        await user.save();

        await sendMail(user.email, 'Your Verification Code', otpTemplate("User", otpCode));

        res.json({ message: 'OTP resent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'User not verified' });
        }

        const token = generateToken(user); // ✅ updated
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find().select('-password -otp');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -otp');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-password -otp');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
