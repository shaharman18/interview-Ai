const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authroute');
const interviewRouter = require('./routes/interview.route');
const cors = require('cors');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean), // remove undefined if FRONTEND_URL is not set
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/api/auth', authRouter);
app.use('/api/interviews', interviewRouter)

// Global error handler - must return JSON so CORS headers are preserved
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;