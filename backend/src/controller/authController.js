const User = require('src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('src/middleware/auth.meddleware');
const BlackList = require('src/models/blackList');


async function register(req, res) {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passhash = await bcrypt.hash(password, salt);

        // Create new user

        const newUser = await User.create({ username, email, password: passhash });



        //  token generation
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.cookie('token', token);
        res.status(201).json({ message: 'User registered successfully', token });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Check password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        //  token generation
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.cookie('token', token);
        res.status(200).json({ message: 'Login successful', 
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function logout(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);

    await BlackList.create({ token, expiresAt   });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}


async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user:{
            id: user._id,
            username: user.username,
            email: user.email
        } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   


module.exports = { register , login, logout, getProfile };         