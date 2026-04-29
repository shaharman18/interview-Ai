const express = require('express');
const { 
    register, 
    login, 
    logout, 
    getProfile, 
    updateProfile, 
    sendRegistrationOTP, 
    forgotPassword, 
    resetPassword 
} = require('../controller/authController');
const authMiddleware = require('../middleware/auth.middleware');
const authRouter = express.Router();

authRouter.post('/send-otp', sendRegistrationOTP);
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authMiddleware, logout);
authRouter.get('/getme', authMiddleware, getProfile);
authRouter.put('/update-profile', authMiddleware, updateProfile);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;