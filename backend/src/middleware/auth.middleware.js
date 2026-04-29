const jwt = require('jsonwebtoken');
const BlackList = require('../models/blackList');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const blacklistedToken = await BlackList.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;