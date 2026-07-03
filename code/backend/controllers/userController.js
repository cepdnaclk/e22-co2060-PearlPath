const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendResetEmail = async (email, code) => {
    console.log(`[Email Mock] Sending reset password code ${code} to ${email}`);

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"PearlPath Support" <no-reply@pearlpath.com>',
            to: email,
            subject: 'PearlPath Password Reset Code',
            text: `Your password reset verification code is: ${code}. It will expire in 15 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>PearlPath Password Reset</h2>
                    <p>You requested to reset your password. Use the following verification code:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 15 minutes. If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_please_change', {
        expiresIn: '30d',
    });
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, phone },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: 'An error occurred while updating user profile' });
    }
};

const sendVerificationCodeEmail = async (email, code) => {
    console.log(`[Email Mock] Sending signup verification code ${code} to ${email}`);

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"PearlPath Support" <no-reply@pearlpath.com>',
            to: email,
            subject: 'PearlPath Email Verification Code',
            text: `Your email verification code is: ${code}. It will expire in 24 hours.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>PearlPath Account Verification</h2>
                    <p>Thank you for registering on PearlPath! Please verify your email address by using the following code:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 24 hours. If you did not register for this account, you can safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    }
};

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body || {};

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userRole = role || 'tourist';
        const status = userRole === 'tourist' ? 'approved' : 'pending';

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            phone, 
            password, 
            role: userRole,
            status,
            isEmailVerified: false,
            emailVerificationCode: code,
            emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });
        
        await newUser.save();

        try {
            await sendVerificationCodeEmail(email, code);
        } catch (emailErr) {
            console.error("Error sending verification code email during signup:", emailErr);
        }

        res.status(201).json({ 
            message: 'User created successfully. Verification code sent to your email.', 
            user: { 
                _id: newUser._id, 
                firstName: newUser.firstName, 
                lastName: newUser.lastName, 
                email: newUser.email, 
                role: newUser.role,
                status: newUser.status,
                isEmailVerified: false
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'An error occurred during signup', error: error.message, stack: error.stack });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Lock account if email is unverified (strictly false check for backward-compatibility)
        if (user.isEmailVerified === false) {
            return res.status(403).json({ 
                message: 'Please verify your email first.',
                isEmailVerified: false,
                email: user.email,
                role: user.role
            });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            user: { 
                _id: user._id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                role: user.role,
                status: user.status
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = code;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        try {
            await sendResetEmail(email, code);
        } catch (emailErr) {
            console.error("Error sending password reset email:", emailErr);
        }

        res.status(200).json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body || {};
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        res.status(200).json({ message: 'Verification code is valid' });
    } catch (error) {
        console.error("Verify code error:", error);
        res.status(500).json({ message: 'An error occurred while verifying the code' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body || {};
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code and new password are required' });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.password = newPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'An error occurred while resetting your password' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body || {};
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const user = await User.findOne({
            email,
            emailVerificationCode: code,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({ 
            message: 'Email verified successfully!', 
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                isEmailVerified: true
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ message: 'An error occurred during email verification' });
    }
};

const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationCode = code;
        user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        try {
            await sendVerificationCodeEmail(email, code);
        } catch (emailErr) {
            console.error("Error sending verification code email:", emailErr);
        }

        res.status(200).json({ message: 'Verification code resent to your email' });
    } catch (error) {
        console.error("Resend verification code error:", error);
        res.status(500).json({ message: 'An error occurred while resending the code' });
    }
};

module.exports = { signup, login, getUsers, updateUser, forgotPassword, verifyCode, resetPassword, verifyEmail, resendVerificationCode };
