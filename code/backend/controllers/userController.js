const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body || {};

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstName, lastName, email, phone, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: { _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email } });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
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

module.exports = { signup, login, getUsers };
