const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body || {};

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default role to tourist if not provided
        const userRole = role || 'tourist';
        
        // Tourists are auto-approved, owners/admins are pending by default (or admins can be auto-approved depending on setup, but let's make only tourists auto-approved)
        const status = userRole === 'tourist' ? 'approved' : 'pending';

        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            phone, 
            password, 
            role: userRole,
            status 
        });
        
        await newUser.save();

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { 
                _id: newUser._id, 
                firstName: newUser.firstName, 
                lastName: newUser.lastName, 
                email: newUser.email, 
                role: newUser.role,
                status: newUser.status
            },
            token: generateToken(newUser._id)
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

module.exports = { signup, login, getUsers, updateUser };
