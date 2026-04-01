const express = require('express');
const { register } = require('src/controller/authController');
const { login } = require('src/controller/authController');
const { logout } = require('src/controller/authController');
const{ getProfile } = require('src/controller/authController');
const authMiddleware = require('src/middleware/auth.meddleware');
const authRouter = express.Router();



authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',authMiddleware, logout);
authRouter.get('/getme', authMiddleware, getProfile);




module.exports = authRouter;