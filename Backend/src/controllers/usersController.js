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
            aadhar, city, address, status,
            captcha, sessionCaptcha
        } = req.body;


        // ✅ Captcha check
        if (captcha !== sessionCaptcha) {
            return res.status(400).json({ message: 'Invalid captcha' });
        }

        // Check if user already exists
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
            status,
            verified: true 
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            message: 'User registered successfully',
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

        const token = generateToken(user); 
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


