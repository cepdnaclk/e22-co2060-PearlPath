const User = require('../models/User');
const TourGuide = require('../models/TourGuide');

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

        const newUser = new User({ firstName, lastName, email, phone, password, role: role || 'tourist' });
        await newUser.save();

        // Auto-create TourGuide profile
        if (newUser.role === 'tour_guide') {
            const newGuide = new TourGuide({
                userId: newUser._id,
                name: `${newUser.firstName} ${newUser.lastName}`,
                location: 'City, Country',
                contactEmail: newUser.email,
                pricePerDay: 0,
                experienceYears: 0,
                languages: ["English"]
            });
            await newGuide.save();
        }

        res.status(201).json({ message: 'User created successfully', user: { _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: newUser.role } });
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

        res.status(200).json({ message: 'Login successful', user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
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

