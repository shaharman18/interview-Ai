const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authroute');

app.use(express.json());
app.use(cookieParser());

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/api/auth', authRouter);

module.exports = app;